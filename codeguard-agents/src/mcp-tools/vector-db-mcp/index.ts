import { McpHonoServerDO } from "@nullshot/mcp/hono-server";
import { Implementation } from "@modelcontextprotocol/sdk/types.js";
import type { Env } from "../../shared/types";

/**
 * Vector DB MCP
 * Semantic search over historical exploits using Cloudflare Vectorize
 */
export class VectorDBMCP extends McpHonoServerDO<Env> {
  getImplementation(): Implementation {
    return {
      name: "VectorDBMCP",
      version: "1.0.0",
      vendor: "CodeGuard",
    };
  }

  protected configureServer(server: any): void {
    // Tool: Semantic search
    server.tool(
      "semanticSearch",
      "Search for similar exploits using semantic similarity",
      async (params: { query: string; topK?: number }) => {
        const { query, topK = 5 } = params;
        
        try {
          const results = await this.searchExploits(query, topK);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ results, count: results.length }, null, 2),
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Tool: Store exploit
    server.tool(
      "storeExploit",
      "Store new exploit in vector database",
      async (params: { 
        exploitId: string;
        description: string;
        exploitType: string;
        date: string;
        lossUsd: number;
        report: string;
      }) => {
        try {
          const id = await this.storeExploit(params);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ success: true, id }),
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Tool: Find similar contracts
    server.tool(
      "findSimilarContracts",
      "Find contracts with similar bytecode patterns",
      async (params: { bytecode: string; topK?: number }) => {
        const { bytecode, topK = 5 } = params;
        
        try {
          const results = await this.findSimilarContracts(bytecode, topK);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ results, count: results.length }, null, 2),
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            isError: true,
          };
        }
      }
    );
  }

  private async searchExploits(query: string, topK: number): Promise<any[]> {
    // Generate embedding for query
    const embedding = await this.generateEmbedding(query);
    
    // Search in Vectorize
    const results = await this.env.VECTORIZE.query(embedding, {
      topK,
      returnMetadata: true,
    });
    
    return results.matches.map((match: any) => ({
      exploitId: match.id,
      similarity: match.score,
      exploitType: match.metadata?.exploitType,
      date: match.metadata?.date,
      description: match.metadata?.description,
      lossUsd: match.metadata?.lossUsd,
      report: match.metadata?.report,
    }));
  }

  private async storeExploit(exploit: any): Promise<string> {
    const embedding = await this.generateEmbedding(exploit.description);
    
    await this.env.VECTORIZE.upsert([{
      id: exploit.exploitId,
      values: embedding,
      metadata: {
        exploitType: exploit.exploitType,
        date: exploit.date,
        description: exploit.description,
        lossUsd: exploit.lossUsd,
        report: exploit.report,
      },
    }]);
    
    return exploit.exploitId;
  }

  private async findSimilarContracts(bytecode: string, topK: number): Promise<any[]> {
    // Generate embedding for bytecode pattern
    const pattern = this.extractBytecodePattern(bytecode);
    const embedding = await this.generateEmbedding(pattern);
    
    const results = await this.env.VECTORIZE.query(embedding, {
      topK,
      returnMetadata: true,
      filter: { namespace: "contracts" },
    });
    
    return results.matches.map((match: any) => ({
      address: match.id,
      similarity: match.score,
      pattern: match.metadata?.pattern,
    }));
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Use OpenAI embeddings
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });
    
    const data = await response.json();
    return data.data[0].embedding;
  }

  private extractBytecodePattern(bytecode: string): string {
    // Extract meaningful patterns from bytecode
    const patterns = [];
    
    if (bytecode.includes("f4")) patterns.push("DELEGATECALL");
    if (bytecode.includes("ff")) patterns.push("SELFDESTRUCT");
    if (bytecode.includes("3d3d3d3d")) patterns.push("MINIMAL_PROXY");
    
    return patterns.join(" ");
  }
}
