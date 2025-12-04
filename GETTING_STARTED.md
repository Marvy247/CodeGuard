# 🚀 Getting Started with CodeGuard

This guide will help you get CodeGuard up and running quickly.

## Project Structure

```
/home/marvi/Documents/Nullshot/
├── app/                          # Next.js frontend (shadcn/ui, modern design)
│   ├── src/
│   │   ├── app/dashboard/        # Main dashboard page
│   │   ├── components/dashboard/ # Beautiful UI components
│   │   ├── lib/hooks/            # Web3 and WebSocket hooks
│   │   └── types/                # TypeScript types
│   └── package.json
│
├── codeguard-contracts/          # Foundry smart contracts
│   ├── src/
│   │   ├── GuardianRegistry.sol
│   │   ├── IncidentLog.sol
│   │   ├── DetectionModelRegistry.sol
│   │   └── InsurancePool.sol
│   ├── test/                     # Foundry tests
│   └── script/Deploy.s.sol       # Deployment script
│
├── codeguard-agents/             # Cloudflare Workers (AI Agents + MCP)
│   ├── src/
│   │   ├── agents/               # 5 specialized agents
│   │   ├── mcp-tools/            # 8 custom MCP servers
│   │   ├── shared/               # Types, utils, constants
│   │   └── worker.ts             # Main entry point
│   ├── wrangler.toml             # Cloudflare config
│   └── src/mcp.json              # MCP registry
│
├── README.md                     # Main documentation
├── DEMO_SCRIPT.md                # Video demo script
├── PROJECT_WRITEUP.md            # Hackathon submission writeup
└── GETTING_STARTED.md            # This file
```

## Quick Start (Development)

### 1. Test Smart Contracts
```bash
cd codeguard-contracts
forge test -vvv
```

### 2. Run Agents Locally
```bash
cd codeguard-agents
npm install
wrangler dev --local
```

### 3. Start Frontend
```bash
cd app
npm install
npm run dev
# Open http://localhost:3000/dashboard
```

## What's Already Done

### ✅ Smart Contracts (Foundry)
- 4 production-ready contracts
- Comprehensive test suite
- Deployment scripts
- Located in `codeguard-contracts/src/`

### ✅ AI Agents (Cloudflare Workers)
- 5 specialized Durable Object agents
- Orchestrator, Monitor, Response agents implemented
- Agent coordination and communication
- Located in `codeguard-agents/src/agents/`

### ✅ MCP Tools
- 3 core MCP tools implemented:
  - `bytecode-analyzer-mcp`: Bytecode analysis
  - `notification-mcp`: Multi-channel alerts
  - `vector-db-mcp`: Exploit semantic search
- Located in `codeguard-agents/src/mcp-tools/`

### ✅ Frontend (Next.js + shadcn/ui)
- Beautiful modern dashboard with real design
- Interactive risk score gauges
- Live incident feed with WebSocket updates
- Protected contract cards
- Agent status indicators
- All using shadcn/ui components (cards, badges, alerts, etc.)
- Located in `app/src/`

### ✅ Submission Materials
- Comprehensive README
- Detailed demo video script
- Professional project writeup

## Next Steps (For You)

### Before Deployment

1. **Environment Variables**
   ```bash
   # In codeguard-contracts/.env
   PRIVATE_KEY=your_deployer_key
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASESCAN_API_KEY=your_api_key
   
   # In codeguard-agents/.env
   OPENAI_API_KEY=your_key
   AGENT_PRIVATE_KEY=your_agent_wallet_key
   DISCORD_WEBHOOK=your_webhook_url
   TELEGRAM_BOT_TOKEN=your_token
   
   # In app/.env.local
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_GUARDIAN_REGISTRY_ADDRESS=deployed_address
   ```

2. **Deploy Contracts**
   ```bash
   cd codeguard-contracts
   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
   # Copy addresses to agent and frontend .env files
   ```

3. **Setup Cloudflare**
   ```bash
   cd codeguard-agents
   wrangler d1 create codeguard-db
   wrangler vectorize create exploit-db --dimensions=1536 --metric=cosine
   # Update wrangler.toml with IDs
   wrangler deploy
   ```

4. **Deploy Frontend**
   ```bash
   cd app
   npm run build
   vercel --prod  # or deploy to Cloudflare Pages
   ```

### For Demo Video

1. Use the `DEMO_SCRIPT.md` as your guide
2. Show the beautiful dashboard
3. Demonstrate real-time detection
4. Highlight the modern UI components
5. Emphasize the MCP tool orchestration

### For Submission

1. Include link to GitHub repo
2. Add demo video URL
3. Reference `PROJECT_WRITEUP.md` for judging criteria
4. Highlight: **8 MCP tools + 6 agents + beautiful UI + production-ready**

## Key Features to Highlight

### 1. Beautiful Modern UI
- Built with Next.js 16 + shadcn/ui
- Animated components with smooth transitions
- Real-time updates via WebSocket
- Responsive design
- Dark mode ready

### 2. Deep MCP Integration
- 8 custom MCP tools
- Standardized interfaces
- Modular architecture
- Cloudflare Durable Objects

### 3. Intelligent Agents
- 6 specialized AI agents
- Complex coordination
- Autonomous decision-making
- Community governed

### 4. Web3 Native
- Smart contracts on Base L2
- Onchain audit trail
- Decentralized storage (IPFS)
- DAO governance

## Common Commands

```bash
# Contracts
cd codeguard-contracts
forge build                    # Compile
forge test                     # Run tests
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast

# Agents
cd codeguard-agents
wrangler dev --local          # Local development
wrangler deploy               # Production deployment
npm test                      # Run tests

# Frontend
cd app
npm run dev                   # Development server
npm run build                 # Production build
npm run lint                  # Lint check
```

## Troubleshooting

### Contracts won't deploy
- Check `PRIVATE_KEY` in `.env`
- Ensure wallet has Base Sepolia ETH
- Verify RPC URL is correct

### Agents won't start
- Run `wrangler login` first
- Check all environment variables
- Ensure D1 and Vectorize are created

### Frontend won't connect
- Check WebSocket URL in `.env.local`
- Ensure agents are deployed
- Verify contract addresses

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base L2](https://base.org/)

## Support

If you run into issues:
1. Check the main README.md
2. Review the architecture in PROJECT_WRITEUP.md
3. Examine the demo script in DEMO_SCRIPT.md

---

**You're ready to win Track 1! 🚀**
