import { DurableObject } from "cloudflare:workers";
import { createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import type { Env } from "../../shared/types";
import { generateIncidentId } from "../../shared/utils";

/**
 * Response Agent
 * Executes emergency actions when critical threats detected
 */
export class ResponseAgent extends DurableObject<Env> {
  private account: any;
  private client: any;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.initializeWallet();
  }

  private initializeWallet(): void {
    this.account = privateKeyToAccount(this.env.AGENT_PRIVATE_KEY as `0x${string}`);
    this.client = createWalletClient({
      account: this.account,
      chain: base,
      transport: http(this.env.BASE_RPC_URL),
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/emergency-pause" && request.method === "POST") {
      return this.handleEmergencyPause(request);
    }

    if (url.pathname === "/execute" && request.method === "POST") {
      return this.handleExecute(request);
    }

    if (url.pathname === "/status") {
      return this.handleStatusRequest();
    }

    return new Response("Not found", { status: 404 });
  }

  private async handleEmergencyPause(request: Request): Promise<Response> {
    try {
      const body = await request.json() as {
        contractAddress: string;
        riskScore: number;
        reason: string;
        details?: any;
      };

      const { contractAddress, riskScore, reason, details } = body;

      // Execute emergency pause
      const result = await this.executeEmergencyPause(contractAddress, reason, riskScore);

      // Send notifications
      await this.sendAlerts(contractAddress, riskScore, reason);

      // Log incident
      await this.logIncident(contractAddress, riskScore, reason, details);

      return Response.json({
        success: true,
        txHash: result.txHash,
        contractAddress,
        action: "emergency-pause",
      });
    } catch (error) {
      return Response.json({
        error: error instanceof Error ? error.message : "Unknown error",
      }, { status: 500 });
    }
  }

  private async handleExecute(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      
      // Execute action based on payload
      const result = await this.executeAction(body);

      return Response.json(result);
    } catch (error) {
      return Response.json({
        error: error instanceof Error ? error.message : "Unknown error",
      }, { status: 500 });
    }
  }

  private async handleStatusRequest(): Promise<Response> {
    const status = {
      agent: "response",
      status: "healthy",
      walletAddress: this.account.address,
      timestamp: Date.now(),
    };

    return Response.json(status);
  }

  private async executeEmergencyPause(
    contractAddress: string,
    reason: string,
    riskScore: number
  ): Promise<any> {
    // Call GuardianRegistry.emergencyPause()
    const guardianRegistryAbi = parseAbi([
      "function emergencyPause(address _contractAddress, string memory _reason, uint256 _riskScore) external",
    ]);

    try {
      const hash = await this.client.writeContract({
        address: this.env.GUARDIAN_REGISTRY_ADDRESS as `0x${string}`,
        abi: guardianRegistryAbi,
        functionName: "emergencyPause",
        args: [contractAddress as `0x${string}`, reason, BigInt(riskScore)],
      });

      console.log(`Emergency pause executed. Tx: ${hash}`);

      return {
        success: true,
        txHash: hash,
      };
    } catch (error) {
      console.error("Error executing emergency pause:", error);
      throw error;
    }
  }

  private async sendAlerts(
    contractAddress: string,
    riskScore: number,
    reason: string
  ): Promise<void> {
    // Send Discord alert
    try {
      await fetch(this.env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🚨 CRITICAL SECURITY ALERT",
            description: `**Contract:** ${contractAddress}\n**Risk Score:** ${riskScore}/100\n**Reason:** ${reason}\n\n**Action Taken:** Contract has been paused`,
            color: 0xff0000,
            timestamp: new Date().toISOString(),
            footer: {
              text: "CodeGuard AI Security Agent",
            },
          }],
        }),
      });
    } catch (error) {
      console.error("Error sending Discord alert:", error);
    }

    // Send Telegram alert
    try {
      const message = `🚨 *CRITICAL SECURITY ALERT*\n\n*Contract:* \`${contractAddress}\`\n*Risk Score:* ${riskScore}/100\n*Reason:* ${reason}\n\n*Action:* Contract paused`;
      
      await fetch(
        `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "-1001234567890", // Replace with actual chat ID
            text: message,
            parse_mode: "Markdown",
          }),
        }
      );
    } catch (error) {
      console.error("Error sending Telegram alert:", error);
    }
  }

  private async logIncident(
    contractAddress: string,
    riskScore: number,
    reason: string,
    details: any
  ): Promise<void> {
    const incidentId = generateIncidentId();

    // Store in D1 database
    try {
      await this.env.DB.prepare(
        `INSERT INTO incidents (id, contract_address, incident_type, risk_score, timestamp, detected_by, resolved, ipfs_report)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          incidentId,
          contractAddress,
          reason,
          riskScore,
          Date.now(),
          this.account.address,
          false,
          "" // IPFS hash would go here
        )
        .run();
    } catch (error) {
      console.error("Error logging incident to D1:", error);
    }

    // Optionally store detailed report in IPFS
    try {
      const report = {
        incidentId,
        contractAddress,
        riskScore,
        reason,
        details,
        timestamp: new Date().toISOString(),
        detectedBy: this.account.address,
      };

      // Store in IPFS (simplified)
      console.log("Incident report:", report);
    } catch (error) {
      console.error("Error storing report in IPFS:", error);
    }
  }

  private async executeAction(payload: any): Promise<any> {
    // Execute custom actions based on payload
    console.log("Executing action:", payload);
    return { success: true };
  }
}
