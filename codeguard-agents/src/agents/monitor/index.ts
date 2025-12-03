import { DurableObject } from "cloudflare:workers";
import type { Env, Transaction, TxAnalysis } from "../../shared/types";
import { RISK_THRESHOLDS } from "../../shared/constants";

/**
 * Monitor Agent
 * Continuously monitors protected contracts for suspicious activity
 */
export class MonitorAgent extends DurableObject<Env> {
  private monitoredContracts: Map<string, any>;
  private alertThreshold: number;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.monitoredContracts = new Map();
    this.alertThreshold = RISK_THRESHOLDS.HIGH;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/scan" && request.method === "POST") {
      return this.handleScanRequest(request);
    }

    if (url.pathname === "/subscribe" && request.method === "POST") {
      return this.handleSubscribeRequest(request);
    }

    if (url.pathname === "/process" && request.method === "POST") {
      return this.handleProcessRequest(request);
    }

    if (url.pathname === "/status") {
      return this.handleStatusRequest();
    }

    return new Response("Not found", { status: 404 });
  }

  private async handleScanRequest(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { contractAddress: string };
      const { contractAddress } = body;

      // Perform contract scan
      const scanResult = await this.scanContract(contractAddress);

      return Response.json(scanResult);
    } catch (error) {
      return Response.json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 });
    }
  }

  private async handleSubscribeRequest(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { contractAddress: string; protocolName: string };
      const { contractAddress, protocolName } = body;

      // Add to monitored contracts
      this.monitoredContracts.set(contractAddress, {
        address: contractAddress,
        name: protocolName,
        subscribedAt: Date.now(),
        lastCheck: Date.now(),
        eventCount: 0,
      });

      await this.ctx.storage.put(`contract:${contractAddress}`, {
        address: contractAddress,
        name: protocolName,
      });

      return Response.json({ success: true, contractAddress });
    } catch (error) {
      return Response.json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 });
    }
  }

  private async handleProcessRequest(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      
      // Process incoming message from orchestrator
      await this.processMessage(body);

      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 });
    }
  }

  private async handleStatusRequest(): Promise<Response> {
    const status = {
      agent: "monitor",
      status: "healthy",
      monitoredContracts: this.monitoredContracts.size,
      lastCheck: Date.now(),
    };

    return Response.json(status);
  }

  private async scanContract(contractAddress: string): Promise<any> {
    // Step 1: Fetch recent transactions
    const recentTxs = await this.getRecentTransactions(contractAddress);

    // Step 2: Analyze each transaction
    const analyses: TxAnalysis[] = [];
    let maxRiskScore = 0;

    for (const tx of recentTxs) {
      const analysis = await this.analyzeTransaction(tx);
      analyses.push(analysis);
      maxRiskScore = Math.max(maxRiskScore, analysis.riskScore);
    }

    // Step 3: Detect anomalies
    const anomalies = analyses.filter(a => a.isAnomalous);

    // Step 4: If high risk, escalate
    if (maxRiskScore >= this.alertThreshold) {
      await this.escalateToOrchestrator(contractAddress, maxRiskScore, anomalies);
    }

    return {
      contractAddress,
      scannedAt: Date.now(),
      transactionsAnalyzed: recentTxs.length,
      anomaliesDetected: anomalies.length,
      maxRiskScore,
      anomalies: anomalies.slice(0, 5), // Top 5 anomalies
    };
  }

  private async getRecentTransactions(contractAddress: string): Promise<Transaction[]> {
    // Fetch from Alchemy or similar service
    try {
      const response = await fetch(
        `https://base-mainnet.g.alchemy.com/v2/${this.env.ALCHEMY_API_KEY}/getTransactionHistory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getAssetTransfers",
            params: [{
              fromBlock: "latest",
              toAddress: contractAddress,
              category: ["external", "internal"],
              maxCount: 50,
            }],
          }),
        }
      );

      const data = await response.json();
      
      // Convert to Transaction format
      return (data.result?.transfers || []).map((transfer: any) => ({
        hash: transfer.hash,
        from: transfer.from,
        to: transfer.to,
        value: transfer.value?.toString() || "0",
        data: transfer.rawContract?.address || "0x",
        gasLimit: "0",
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  private async analyzeTransaction(tx: Transaction): Promise<TxAnalysis> {
    const reasons: string[] = [];
    const patterns: string[] = [];
    let riskScore = 0;

    // Check for large value transfers
    const value = BigInt(tx.value || "0");
    if (value > BigInt(10 ** 18)) { // > 1 ETH
      reasons.push("Large value transfer");
      riskScore += 20;
    }

    // Check for suspicious patterns in data
    if (tx.data && tx.data.length > 10) {
      if (tx.data.includes("f4")) { // DELEGATECALL
        patterns.push("DELEGATECALL");
        riskScore += 30;
      }
      if (tx.data.includes("ff")) { // SELFDESTRUCT
        patterns.push("SELFDESTRUCT");
        riskScore += 50;
      }
    }

    // Check gas usage anomalies
    const gasLimit = BigInt(tx.gasLimit || "0");
    if (gasLimit > BigInt(5000000)) {
      reasons.push("Unusually high gas limit");
      riskScore += 15;
    }

    return {
      isAnomalous: riskScore > 30,
      riskScore: Math.min(100, riskScore),
      reasons,
      patterns,
    };
  }

  private async processMessage(message: any): Promise<void> {
    // Handle messages from orchestrator
    console.log("Processing message:", message);
  }

  private async escalateToOrchestrator(
    contractAddress: string,
    riskScore: number,
    anomalies: TxAnalysis[]
  ): Promise<void> {
    // Get orchestrator
    const orchestratorId = this.env.ORCHESTRATOR.idFromName("global");
    const orchestrator = this.env.ORCHESTRATOR.get(orchestratorId);

    // Send alert
    await orchestrator.fetch(new Request("https://internal/alert", {
      method: "POST",
      body: JSON.stringify({
        from: "monitor",
        contractAddress,
        riskScore,
        anomalies,
        timestamp: Date.now(),
      }),
    }));
  }

  async alarm(): Promise<void> {
    // Periodic scan of all monitored contracts
    console.log("Running periodic contract scan");

    for (const [address] of this.monitoredContracts) {
      try {
        await this.scanContract(address);
      } catch (error) {
        console.error(`Error scanning contract ${address}:`, error);
      }
    }

    // Schedule next alarm in 10 minutes
    await this.ctx.storage.setAlarm(Date.now() + 10 * 60 * 1000);
  }
}
