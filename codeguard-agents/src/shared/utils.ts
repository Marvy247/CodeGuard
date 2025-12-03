import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";
import type { Env } from "./types";

export function calculateRiskScore(vulnerabilities: Array<{ severity: string; confidence: number }>): number {
  if (vulnerabilities.length === 0) return 0;
  
  const severityWeights = { critical: 100, high: 75, medium: 50, low: 25 };
  
  let totalScore = 0;
  for (const vuln of vulnerabilities) {
    const weight = severityWeights[vuln.severity as keyof typeof severityWeights] || 25;
    totalScore += weight * vuln.confidence;
  }
  
  return Math.min(100, Math.round(totalScore / vulnerabilities.length));
}

export function getPublicClient(env: Env, chainId: number = 8453) {
  const rpcUrl = chainId === 8453 ? env.BASE_RPC_URL : "https://mainnet.base.org";
  
  return createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });
}

export async function getContractBytecode(
  env: Env,
  contractAddress: string
): Promise<string | null> {
  const client = getPublicClient(env);
  
  try {
    const bytecode = await client.getBytecode({ address: contractAddress as `0x${string}` });
    return bytecode || null;
  } catch (error) {
    console.error("Error fetching bytecode:", error);
    return null;
  }
}

export function generateIncidentId(): string {
  return `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

export async function storeInIPFS(env: Env, data: any): Promise<string> {
  // Simplified IPFS storage using web3.storage
  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WEB3_STORAGE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to store in IPFS: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.cid;
}

export function detectVulnerabilityPatterns(bytecode: string): string[] {
  const patterns: string[] = [];
  
  // Simple pattern detection (in production, use more sophisticated analysis)
  if (/DELEGATECALL/i.test(bytecode)) {
    patterns.push("delegatecall-detected");
  }
  if (/SELFDESTRUCT/i.test(bytecode)) {
    patterns.push("selfdestruct-detected");
  }
  if (/CALLCODE/i.test(bytecode)) {
    patterns.push("callcode-detected");
  }
  
  return patterns;
}

export async function sendDiscordAlert(
  webhookUrl: string,
  title: string,
  description: string,
  color: number = 0xff0000
): Promise<void> {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        description,
        color,
        timestamp: new Date().toISOString(),
      }],
    }),
  });
}

export function isAddressValid(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
