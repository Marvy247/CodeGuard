import { McpBaseDO } from "../../shared/mcp-base";
import type { Env } from "../../shared/types";

/**
 * Bytecode Analyzer MCP
 * Provides tools for analyzing smart contract bytecode
 */
export class BytecodeAnalyzerMCP extends McpBaseDO {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  protected setupRoutes(): void {
    // Tool: Decompile bytecode
    this.app.post("/decompile", async (c) => {
      const params = await c.req.json() as { address: string; chain?: string };
      const { address, chain = "base" } = params;
      
      try {
        const bytecode = await this.fetchBytecode(address);
        const decompiled = this.decompileBytecode(bytecode);
        
        return c.json({ address, decompiled, bytecodeLength: bytecode.length });
      } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
      }
    });

    // Tool: Detect vulnerability patterns
    this.app.post("/detectPatterns", async (c) => {
      const { bytecode } = await c.req.json() as { bytecode: string };
      const patterns = this.detectPatterns(bytecode);
      return c.json({ patterns, count: patterns.length });
    });

    // Tool: Extract function signatures
    this.app.post("/extractFunctions", async (c) => {
      const { address } = await c.req.json() as { address: string };
      
      try {
        const bytecode = await this.fetchBytecode(address);
        const functions = this.extractFunctions(bytecode);
        return c.json({ address, functions });
      } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
      }
    });

    // Tool: Similarity search
    this.app.post("/similaritySearch", async (c) => {
      const { bytecode, topK = 5 } = await c.req.json() as { bytecode: string; topK?: number };
      const similar = await this.findSimilarContracts(bytecode, topK);
      return c.json({ similar, count: similar.length });
    });
  }

  private async fetchBytecode(address: string): Promise<string> {
    // Check cache first
    const cached = await this.env.KV.get(`bytecode:${address}`);
    if (cached) return cached;

    // Fetch from RPC
    const response = await fetch(this.env.BASE_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getCode",
        params: [address, "latest"],
        id: 1,
      }),
    });

    const data = await response.json();
    const bytecode = data.result || "0x";

    // Cache for 1 week
    await this.env.KV.put(`bytecode:${address}`, bytecode, { expirationTtl: 604800 });

    return bytecode;
  }

  private decompileBytecode(bytecode: string): any {
    // Simplified decompilation (in production, use tools like Panoramix or Dedaub)
    return {
      opcodes: bytecode.match(/.{1,2}/g)?.slice(0, 50) || [],
      length: bytecode.length,
      hasDelegate: bytecode.includes("f4"), // DELEGATECALL opcode
      hasSelfDestruct: bytecode.includes("ff"), // SELFDESTRUCT opcode
    };
  }

  private detectPatterns(bytecode: string): string[] {
    const patterns: string[] = [];

    if (bytecode.includes("f4")) patterns.push("DELEGATECALL");
    if (bytecode.includes("ff")) patterns.push("SELFDESTRUCT");
    if (bytecode.includes("f2")) patterns.push("CALLCODE");
    if (bytecode.includes("fa")) patterns.push("STATICCALL");

    return patterns;
  }

  private extractFunctions(bytecode: string): string[] {
    // Extract 4-byte function selectors (simplified)
    const selectors: string[] = [];
    const matches = bytecode.match(/63([0-9a-f]{8})/gi);

    if (matches) {
      for (const match of matches) {
        selectors.push(`0x${match.substring(2)}`);
      }
    }

    return [...new Set(selectors)].slice(0, 20);
  }

  private async findSimilarContracts(bytecode: string, topK: number): Promise<any[]> {
    // Simplified similarity (in production, use cosine similarity on embeddings)
    return [
      { address: "0x1234...5678", similarity: 0.95 },
      { address: "0xabcd...ef01", similarity: 0.87 },
    ];
  }
}
