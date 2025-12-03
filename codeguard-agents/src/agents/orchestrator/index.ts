import { DurableObject } from "cloudflare:workers";
import type { Env, AgentMessage, ProtectedContract } from "../../shared/types";
import { AGENT_IDS, RISK_THRESHOLDS } from "../../shared/constants";

/**
 * Orchestrator Agent
 * Coordinates all sub-agents and maintains global state
 */
export class OrchestratorAgent extends DurableObject<Env> {
  private connections: Set<WebSocket>;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.connections = new Set();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket endpoint for real-time updates
    if (url.pathname === "/ws") {
      return this.handleWebSocket(request);
    }

    // HTTP API endpoints
    if (url.pathname === "/api/analyze") {
      return this.handleAnalyzeRequest(request);
    }

    if (url.pathname === "/api/status") {
      return this.handleStatusRequest();
    }

    if (url.pathname === "/api/trigger-scan") {
      return this.handleTriggerScan(request);
    }

    return new Response("Not found", { status: 404 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    
    server.accept();
    this.connections.add(server);

    server.addEventListener("close", () => {
      this.connections.delete(server);
    });

    server.addEventListener("message", (event) => {
      this.handleWebSocketMessage(event.data, server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private async handleWebSocketMessage(data: string, socket: WebSocket): Promise<void> {
    try {
      const message: AgentMessage = JSON.parse(data);
      
      // Route message to appropriate agent
      await this.routeMessage(message);
      
      // Send acknowledgment
      socket.send(JSON.stringify({ type: "ack", correlationId: message.correlationId }));
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }

  private async handleAnalyzeRequest(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { contractAddress: string; chainId?: number };
      const { contractAddress, chainId = 8453 } = body;

      // Trigger analysis pipeline
      const result = await this.analyzeContract(contractAddress, chainId);

      return Response.json(result);
    } catch (error) {
      return Response.json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 });
    }
  }

  private async handleStatusRequest(): Promise<Response> {
    const status = {
      orchestrator: "healthy",
      timestamp: Date.now(),
      activeConnections: this.connections.size,
      agents: {
        monitor: "healthy",
        analyzer: "healthy",
        threatIntel: "healthy",
        response: "healthy",
      },
    };

    return Response.json(status);
  }

  private async handleTriggerScan(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { contractAddress: string };
      
      // Get Monitor Agent
      const monitorId = this.env.MONITOR.idFromName("base");
      const monitor = this.env.MONITOR.get(monitorId);
      
      // Trigger scan
      const response = await monitor.fetch(new Request("https://internal/scan", {
        method: "POST",
        body: JSON.stringify(body),
      }));

      return response;
    } catch (error) {
      return Response.json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 });
    }
  }

  private async analyzeContract(contractAddress: string, chainId: number): Promise<any> {
    // Step 1: Fetch bytecode via MCP
    const bytecodeResult = await this.callMCP("bytecode-analyzer", "decompile", {
      address: contractAddress,
      chain: "base",
    });

    // Step 2: Analyze with Threat Intel
    const threatIntelId = this.env.THREAT_INTEL.idFromName("global");
    const threatIntel = this.env.THREAT_INTEL.get(threatIntelId);
    
    const threatResponse = await threatIntel.fetch(new Request("https://internal/analyze", {
      method: "POST",
      body: JSON.stringify({ contractAddress, bytecode: bytecodeResult }),
    }));

    const threatResult = await threatResponse.json();

    // Step 3: Calculate overall risk
    const riskScore = threatResult.riskScore || 0;

    // Step 4: If critical, trigger response agent
    if (riskScore >= RISK_THRESHOLDS.CRITICAL) {
      await this.triggerEmergencyResponse(contractAddress, riskScore, threatResult);
    }

    // Broadcast to all connected clients
    this.broadcastToClients({
      type: "analysis-complete",
      payload: {
        contractAddress,
        riskScore,
        threats: threatResult.threats,
        timestamp: Date.now(),
      },
    });

    return {
      contractAddress,
      riskScore,
      analysis: threatResult,
      actionTaken: riskScore >= RISK_THRESHOLDS.CRITICAL ? "emergency-pause" : "none",
    };
  }

  private async routeMessage(message: AgentMessage): Promise<void> {
    const { to, payload } = message;

    switch (to) {
      case AGENT_IDS.MONITOR:
        await this.forwardToMonitor(payload);
        break;
      case AGENT_IDS.RESPONSE:
        await this.forwardToResponse(payload);
        break;
      default:
        console.warn(`Unknown agent: ${to}`);
    }
  }

  private async forwardToMonitor(payload: any): Promise<void> {
    const monitorId = this.env.MONITOR.idFromName("base");
    const monitor = this.env.MONITOR.get(monitorId);
    
    await monitor.fetch(new Request("https://internal/process", {
      method: "POST",
      body: JSON.stringify(payload),
    }));
  }

  private async forwardToResponse(payload: any): Promise<void> {
    const responseId = this.env.RESPONSE.idFromName("global");
    const response = this.env.RESPONSE.get(responseId);
    
    await response.fetch(new Request("https://internal/execute", {
      method: "POST",
      body: JSON.stringify(payload),
    }));
  }

  private async triggerEmergencyResponse(
    contractAddress: string,
    riskScore: number,
    details: any
  ): Promise<void> {
    const responseId = this.env.RESPONSE.idFromName("global");
    const responseAgent = this.env.RESPONSE.get(responseId);
    
    await responseAgent.fetch(new Request("https://internal/emergency-pause", {
      method: "POST",
      body: JSON.stringify({
        contractAddress,
        riskScore,
        reason: details.primaryThreat || "Critical vulnerability detected",
        details,
      }),
    }));
  }

  private async callMCP(tool: string, method: string, params: any): Promise<any> {
    // Simplified MCP call (in production, use proper MCP client)
    return { success: true, data: params };
  }

  private broadcastToClients(message: any): void {
    const messageStr = JSON.stringify(message);
    
    for (const client of this.connections) {
      try {
        client.send(messageStr);
      } catch (error) {
        console.error("Error broadcasting to client:", error);
        this.connections.delete(client);
      }
    }
  }

  async alarm(): Promise<void> {
    // Periodic health check
    console.log("Orchestrator health check");
    
    // Schedule next alarm in 5 minutes
    await this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);
  }
}
