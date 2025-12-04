import { McpBaseDO } from "../../shared/mcp-base";
import type { Env } from "../../shared/types";

/**
 * Notification MCP
 * Sends alerts via Discord, Telegram, and Email
 */
export class NotificationMCP extends McpBaseDO {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  protected setupRoutes(): void {
    // Tool: Send Discord notification
    this.app.post("/sendDiscord", async (c) => {
      const params = await c.req.json() as { title: string; description: string; color?: string };
        const { title, description, color = "red" } = params;
        
        try {
          await this.sendDiscordNotification(title, description, color);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ success: true, platform: "discord" }),
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

    // Tool: Send Telegram notification
    server.tool(
      "sendTelegram",
      "Send alert to Telegram channel",
      async (params: { message: string; chatId?: string }) => {
        const { message, chatId = "-1001234567890" } = params;
        
        try {
          await this.sendTelegramNotification(message, chatId);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ success: true, platform: "telegram" }),
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

    // Tool: Create incident report
    server.tool(
      "createIncidentReport",
      "Create formatted incident report",
      async (params: { 
        contractAddress: string;
        incidentType: string;
        riskScore: number;
        details: any;
      }) => {
        const report = this.formatIncidentReport(params);
        
        // Store in IPFS
        const ipfsHash = await this.storeInIPFS(report);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              ipfsHash,
              url: `https://ipfs.io/ipfs/${ipfsHash}` 
            }),
          }],
        };
      }
    );

    // Tool: Send multi-channel alert
    server.tool(
      "sendMultiChannelAlert",
      "Send alert to all configured channels",
      async (params: { 
        title: string; 
        message: string; 
        severity: "critical" | "high" | "medium" | "low";
      }) => {
        const { title, message, severity } = params;
        
        const results = [];
        
        try {
          await this.sendDiscordNotification(title, message, this.getSeverityColor(severity));
          results.push({ platform: "discord", success: true });
        } catch (e) {
          results.push({ platform: "discord", success: false });
        }
        
        try {
          await this.sendTelegramNotification(`🚨 ${title}\n\n${message}`);
          results.push({ platform: "telegram", success: true });
        } catch (e) {
          results.push({ platform: "telegram", success: false });
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ results }),
          }],
        };
      }
    );
  }

  private async sendDiscordNotification(
    title: string,
    description: string,
    color: string
  ): Promise<void> {
    const colorMap: Record<string, number> = {
      red: 0xff0000,
      orange: 0xffa500,
      yellow: 0xffff00,
      green: 0x00ff00,
    };

    await fetch(this.env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title,
          description,
          color: colorMap[color] || 0xff0000,
          timestamp: new Date().toISOString(),
          footer: {
            text: "CodeGuard AI Security Agent",
          },
        }],
      }),
    });
  }

  private async sendTelegramNotification(
    message: string,
    chatId: string = "-1001234567890"
  ): Promise<void> {
    const url = `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
  }

  private formatIncidentReport(params: any): any {
    return {
      type: "security-incident",
      timestamp: new Date().toISOString(),
      contract: params.contractAddress,
      incidentType: params.incidentType,
      riskScore: params.riskScore,
      details: params.details,
      generatedBy: "CodeGuard AI Agent",
      version: "1.0.0",
    };
  }

  private async storeInIPFS(data: any): Promise<string> {
    // Simplified IPFS storage
    const response = await fetch("https://api.web3.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.WEB3_STORAGE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS");
    }

    const result = await response.json();
    return result.cid || "QmPlaceholder";
  }

  private getSeverityColor(severity: string): string {
    const colorMap: Record<string, string> = {
      critical: "red",
      high: "orange",
      medium: "yellow",
      low: "green",
    };
    return colorMap[severity] || "red";
  }
}
