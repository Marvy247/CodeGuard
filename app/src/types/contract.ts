export interface ProtectedContract {
  address: string;
  guardian: string;
  riskScore: number;
  isPaused: boolean;
  lastCheckTimestamp: number;
  pausedAt: number;
  protocolName: string;
}

export interface Incident {
  id: string;
  contractAddress: string;
  timestamp: number;
  incidentType: string;
  riskScore: number;
  ipfsReport?: string;
  detectedBy: string;
  wasExploit: boolean;
  resolved: boolean;
  resolvedAt?: number;
}

export interface AgentStatus {
  name: string;
  status: "healthy" | "degraded" | "offline";
  lastHeartbeat: number;
}
