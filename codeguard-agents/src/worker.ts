import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./shared/types";

// Import agents
import { OrchestratorAgent } from "./agents/orchestrator";
import { MonitorAgent } from "./agents/monitor";
import { ResponseAgent } from "./agents/response";

// Import MCP tools
import { BytecodeAnalyzerMCP } from "./mcp-tools/bytecode-analyzer-mcp";
import { NotificationMCP } from "./mcp-tools/notification-mcp";
import { VectorDBMCP } from "./mcp-tools/vector-db-mcp";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use("/*", cors());

// Health check
app.get("/", (c) => {
  return c.json({
    name: "CodeGuard AI Security Agent",
    version: "1.0.0",
    status: "healthy",
    timestamp: Date.now(),
  });
});

// Orchestrator routes
app.all("/orchestrator/*", async (c) => {
  const id = c.env.ORCHESTRATOR.idFromName("global");
  const orchestrator = c.env.ORCHESTRATOR.get(id);
  return orchestrator.fetch(c.req.raw);
});

// Monitor routes
app.all("/monitor/:chain/*", async (c) => {
  const chain = c.req.param("chain");
  const id = c.env.MONITOR.idFromName(chain);
  const monitor = c.env.MONITOR.get(id);
  return monitor.fetch(c.req.raw);
});

// Response routes
app.all("/response/*", async (c) => {
  const id = c.env.RESPONSE.idFromName("global");
  const response = c.env.RESPONSE.get(id);
  return response.fetch(c.req.raw);
});

// MCP tool routes
app.all("/mcp/bytecode/*", async (c) => {
  const id = c.env.BYTECODE_ANALYZER.idFromName("global");
  const mcp = c.env.BYTECODE_ANALYZER.get(id);
  return mcp.fetch(c.req.raw);
});

app.all("/mcp/notification/*", async (c) => {
  const id = c.env.NOTIFICATION.idFromName("global");
  const mcp = c.env.NOTIFICATION.get(id);
  return mcp.fetch(c.req.raw);
});

app.all("/mcp/vector-db/*", async (c) => {
  const id = c.env.VECTOR_DB.idFromName("global");
  const mcp = c.env.VECTOR_DB.get(id);
  return mcp.fetch(c.req.raw);
});

// Public API for frontend
app.post("/api/register-contract", async (c) => {
  try {
    const body = await c.req.json();
    const { contractAddress, protocolName, chain = "base" } = body;

    // Subscribe to monitoring
    const monitorId = c.env.MONITOR.idFromName(chain);
    const monitor = c.env.MONITOR.get(monitorId);
    
    const response = await monitor.fetch(new Request("https://internal/subscribe", {
      method: "POST",
      body: JSON.stringify({ contractAddress, protocolName }),
    }));

    return response;
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

app.post("/api/analyze-contract", async (c) => {
  try {
    const body = await c.req.json();
    const { contractAddress, chainId = 8453 } = body;

    // Forward to orchestrator
    const orchestratorId = c.env.ORCHESTRATOR.idFromName("global");
    const orchestrator = c.env.ORCHESTRATOR.get(orchestratorId);
    
    const response = await orchestrator.fetch(new Request("https://internal/api/analyze", {
      method: "POST",
      body: JSON.stringify({ contractAddress, chainId }),
    }));

    return response;
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

app.get("/api/incidents", async (c) => {
  try {
    const contractAddress = c.req.query("contract");
    const limit = parseInt(c.req.query("limit") || "50");

    let query = "SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?";
    let params = [limit];

    if (contractAddress) {
      query = "SELECT * FROM incidents WHERE contract_address = ? ORDER BY timestamp DESC LIMIT ?";
      params = [contractAddress, limit];
    }

    const result = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({ incidents: result.results });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

// Export Durable Objects
export { OrchestratorAgent, MonitorAgent, ResponseAgent };
export { BytecodeAnalyzerMCP, NotificationMCP, VectorDBMCP };

export default app;
