# 📋 CodeGuard - Command Reference

Quick reference for all common commands.

---

## 🚀 Quick Start

### Start Frontend (Main Demo)
```bash
cd /home/marvi/Documents/Nullshot/app
npm install
npm run dev
# Visit: http://localhost:3000/dashboard
```

### Start AI Agents (Optional)
```bash
cd /home/marvi/Documents/Nullshot/codeguard-agents
npm install
wrangler dev --local
```

---

## 📦 Smart Contracts (Foundry)

### Build & Test
```bash
cd /home/marvi/Documents/Nullshot/codeguard-contracts

# Compile contracts
forge build

# Run tests
forge test

# Run tests with verbosity
forge test -vvv

# Check coverage
forge coverage

# Format code
forge fmt
```

### Deployment
```bash
# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --legacy

# Verify on Basescan
forge verify-contract \
  0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  GuardianRegistry \
  --chain base-sepolia \
  --watch
```

### Contract Interactions
```bash
# Read pause count
cast call 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "pauseCount()(uint256)" \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J

# Check if agent is authorized
cast call 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "hasRole(bytes32,address)(bool)" \
  0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3 \
  0xFCA0157a303d2134854d9cF4718901B6515b0696 \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J

# Register a contract for protection
cast send 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "registerContract(address,address,string)" \
  0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A \
  0xFCA0157a303d2134854d9cF4718901B6515b0696 \
  "My Test Contract" \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --private-key 0x07993b3e9b87e831c76550e5032c87572d2114110ff2dd55f92a4da275af88ce

# Get all protected contracts
cast call 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "getAllProtectedContracts()(address[])" \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J

# Emergency pause (agent only)
cast send 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "emergencyPause(address,string,uint256)" \
  0xCONTRACT_ADDRESS \
  "Reentrancy detected" \
  95 \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --private-key 0x07993b3e9b87e831c76550e5032c87572d2114110ff2dd55f92a4da275af88ce
```

---

## 🤖 AI Agents (Cloudflare Workers)

### Development
```bash
cd /home/marvi/Documents/Nullshot/codeguard-agents

# Install dependencies
npm install

# Local development
wrangler dev --local

# Test agents
npm test

# Type check
npm run type-check
```

### Deployment
```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create codeguard-db

# Create Vectorize index
wrangler vectorize create exploit-db --dimensions=1536 --metric=cosine

# Deploy to production
wrangler deploy

# View logs
wrangler tail

# View deployments
wrangler deployments list
```

### Testing API Endpoints
```bash
# Health check
curl http://localhost:8787/

# Agent status
curl http://localhost:8787/orchestrator/status

# Analyze contract
curl -X POST http://localhost:8787/api/analyze-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x...", "chainId":84532}'

# Get incidents
curl http://localhost:8787/api/incidents?limit=10
```

---

## 🎨 Frontend (Next.js)

### Development
```bash
cd /home/marvi/Documents/Nullshot/app

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next

# Build static export (if needed)
npm run build && npm run export
```

---

## 🔧 Utilities

### Generate ABIs from Contracts
```bash
cd /home/marvi/Documents/Nullshot/codeguard-contracts

# Extract ABIs
forge inspect GuardianRegistry abi > ../app/src/lib/abis/GuardianRegistry.json
forge inspect IncidentLog abi > ../app/src/lib/abis/IncidentLog.json
forge inspect InsurancePool abi > ../app/src/lib/abis/InsurancePool.json
forge inspect DetectionModelRegistry abi > ../app/src/lib/abis/DetectionModelRegistry.json
```

### Check Contract Bytecode
```bash
# Get contract bytecode
cast code 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J

# Get contract storage
cast storage 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d 0 \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
```

### View Transaction Details
```bash
# Get transaction receipt
cast receipt 0xTRANSACTION_HASH \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J

# Decode transaction
cast tx 0xTRANSACTION_HASH \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
```

---

## 📊 Monitoring

### Check Wallet Balance
```bash
# Check deployer balance
cast balance 0xFCA0157a303d2134854d9cF4718901B6515b0696 \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
```

### Watch Contract Events
```bash
# Watch GuardianRegistry events
cast logs --address 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --follow
```

---

## 🎬 Demo Commands

### Full Demo Setup
```bash
# Terminal 1: Start frontend
cd /home/marvi/Documents/Nullshot/app
npm run dev

# Terminal 2: Start agents (optional)
cd /home/marvi/Documents/Nullshot/codeguard-agents
wrangler dev --local

# Terminal 3: Watch contract events (optional)
cd /home/marvi/Documents/Nullshot/codeguard-contracts
cast logs --address 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --follow
```

---

## 🐛 Troubleshooting

### Clear All Caches
```bash
# Clear Next.js cache
cd app
rm -rf .next node_modules
npm install

# Clear Foundry cache
cd ../codeguard-contracts
forge clean
forge build

# Clear Wrangler cache
cd ../codeguard-agents
rm -rf node_modules .wrangler
npm install
```

### Reset Local Environment
```bash
# Kill all node processes
pkill -f node

# Kill all wrangler processes
pkill -f wrangler

# Restart from scratch
cd /home/marvi/Documents/Nullshot/app
npm run dev
```

---

## 📱 Useful URLs

### Local Development
- Frontend: http://localhost:3000/dashboard
- Agents API: http://localhost:8787/
- Agent Status: http://localhost:8787/orchestrator/status

### Base Sepolia
- Explorer: https://sepolia.basescan.org/
- RPC: https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
- Faucet: https://www.alchemy.com/faucets/base-sepolia

### Deployed Contracts
- GuardianRegistry: https://sepolia.basescan.org/address/0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d
- IncidentLog: https://sepolia.basescan.org/address/0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A
- ModelRegistry: https://sepolia.basescan.org/address/0x25B8F8DF7a5a2Db569D93A3340235D25234C6085
- InsurancePool: https://sepolia.basescan.org/address/0x6827513EBA43587B3772F87E2FC90dD787837Bb8

---

## 🔑 Environment Variables

### Key Addresses
```bash
DEPLOYER: 0xFCA0157a303d2134854d9cF4718901B6515b0696
AGENT: 0xFCA0157a303d2134854d9cF4718901B6515b0696
GUARDIAN_REGISTRY: 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d
INCIDENT_LOG: 0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A
MODEL_REGISTRY: 0x25B8F8DF7a5a2Db569D93A3340235D25234C6085
INSURANCE_POOL: 0x6827513EBA43587B3772F87E2FC90dD787837Bb8
```

---

*Quick reference for all CodeGuard commands. For detailed guides, see other documentation files.*
