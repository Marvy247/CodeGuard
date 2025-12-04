import { Hono } from "hono";
import type { Env } from "./types";

/**
 * Base class for MCP Durable Objects
 * Simplified version without @nullshot dependencies
 */
export abstract class McpBaseDO {
  protected state: DurableObjectState;
  protected env: Env;
  protected app: Hono;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.app = new Hono();
    this.setupRoutes();
  }

  protected abstract setupRoutes(): void;

  async fetch(request: Request): Promise<Response> {
    return this.app.fetch(request);
  }
}
