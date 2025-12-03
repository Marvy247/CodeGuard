export interface ProtectedContract {
  address: string;
  chain: string;
  guardian: string;
  riskScore: number;
  isPaused: boolean;
  lastCheck: number;
  protocolName: string;
}

export interface Incident {
  id: string;
  contractAddress: string;
  timestamp: number;
  incidentType: IncidentType;
  riskScore: number;
  ipfsReport?: string;
  detectedBy: string;
  wasExploit: boolean;
  resolved: boolean;
}

export enum IncidentType {
  REENTRANCY = "reentrancy",
  PRICE_MANIPULATION = "price-manipulation",
  ACCESS_CONTROL = "access-control",
  INTEGER_OVERFLOW = "integer-overflow",
  FRONT_RUNNING = "front-running",
  FLASH_LOAN_ATTACK = "flash-loan-attack",
  GOVERNANCE_ATTACK = "governance-attack",
  ANOMALOUS_BEHAVIOR = "anomalous-behavior",
}

export interface VulnerabilityReport {
  contractAddress: string;
  vulnerabilities: Vulnerability[];
  overallRiskScore: number;
  recommendation: string;
  timestamp: number;
}

export interface Vulnerability {
  type: IncidentType;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  location?: string;
  confidence: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface TxAnalysis {
  isAnomalous: boolean;
  riskScore: number;
  reasons: string[];
  patterns: string[];
}

export interface ExploitMatch {
  exploitId: string;
  similarity: number;
  exploitType: string;
  date: string;
  description: string;
  report: string;
}

export interface AgentMessage {
  type: "task" | "result" | "alert" | "heartbeat";
  from: string;
  to: string;
  payload: any;
  timestamp: number;
  correlationId?: string;
}

export interface AgentConfig {
  enabled: boolean;
  riskThreshold: number;
  maxActionsPerHour: number;
  mcpTools: string[];
}

export interface Env {
  // Bindings
  ORCHESTRATOR: DurableObjectNamespace;
  MONITOR: DurableObjectNamespace;
  THREAT_INTEL: DurableObjectNamespace;
  RESPONSE: DurableObjectNamespace;
  DB: D1Database;
  KV: KVNamespace;
  VECTORIZE: VectorizeIndex;
  
  // Secrets
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  AGENT_PRIVATE_KEY: string;
  ALCHEMY_API_KEY: string;
  DISCORD_WEBHOOK: string;
  TELEGRAM_BOT_TOKEN: string;
  WEB3_STORAGE_TOKEN: string;
  
  // Config
  ENVIRONMENT: string;
  GUARDIAN_REGISTRY_ADDRESS: string;
  INCIDENT_LOG_ADDRESS: string;
  BASE_RPC_URL: string;
}
