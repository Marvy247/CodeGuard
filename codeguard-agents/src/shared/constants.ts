export const RISK_THRESHOLDS = {
  CRITICAL: 90,
  HIGH: 70,
  MEDIUM: 50,
  LOW: 30,
} as const;

export const AGENT_IDS = {
  ORCHESTRATOR: "orchestrator",
  MONITOR: "monitor",
  ANALYZER: "analyzer",
  THREAT_INTEL: "threat-intel",
  RESPONSE: "response",
  LEARNING: "learning",
} as const;

export const MCP_TOOLS = {
  BYTECODE_ANALYZER: "bytecode-analyzer",
  MEMPOOL_MONITOR: "mempool-monitor",
  SLITHER: "slither",
  FUZZER: "fuzzer",
  GOVERNANCE: "governance",
  NOTIFICATION: "notification",
  SIMULATION: "simulation",
  VECTOR_DB: "vector-db",
} as const;

export const VULNERABILITY_PATTERNS = {
  REENTRANCY: /delegatecall|call\{value:/gi,
  UNCHECKED_SEND: /send\(|transfer\(/gi,
  TIMESTAMP_DEPENDENCE: /block\.timestamp|now/gi,
  TX_ORIGIN: /tx\.origin/gi,
  UNINITIALIZED_STORAGE: /storage\s+\w+;/gi,
} as const;

export const SUPPORTED_CHAINS = {
  BASE: { chainId: 8453, rpc: "https://mainnet.base.org", name: "Base" },
  BASE_SEPOLIA: { chainId: 84532, rpc: "https://sepolia.base.org", name: "Base Sepolia" },
  ETHEREUM: { chainId: 1, rpc: "https://eth.llamarpc.com", name: "Ethereum" },
  ARBITRUM: { chainId: 42161, rpc: "https://arb1.arbitrum.io/rpc", name: "Arbitrum" },
} as const;

export const RATE_LIMITS = {
  PAUSE_COOLDOWN: 5 * 60, // 5 minutes
  MAX_PAUSES_PER_HOUR: 10,
  MAX_RPC_CALLS_PER_MINUTE: 100,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.9,
  MEDIUM: 0.7,
  LOW: 0.5,
} as const;
