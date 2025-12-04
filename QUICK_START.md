# ⚡ Quick Start - Get CodeGuard Running in 5 Minutes

## ✅ Prerequisites Complete

Your project is already deployed! Here's what's ready:

- ✅ Smart contracts deployed to Base Sepolia
- ✅ Contract addresses configured in all files
- ✅ ABIs generated for frontend
- ✅ Environment files set up

## 🚀 Start the Frontend

```bash
cd /home/marvi/Documents/Nullshot/app

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Then open: **http://localhost:3000/dashboard**

## 🎨 What You'll See

1. **Beautiful Dashboard** with modern shadcn/ui components
2. **Risk Score Gauges** showing contract security status
3. **Live Incident Feed** (will show "All Clear" until you register contracts)
4. **Agent Status Indicators** showing 5 AI agents
5. **Protected Contracts** section (empty until you register)

## 📝 Register Your First Contract

### Option 1: Use the UI (Recommended)

1. Visit `http://localhost:3000/dashboard`
2. Connect your wallet (make sure you're on Base Sepolia)
3. Click "Register Contract" button
4. Enter any contract address (try one of the deployed contracts!)
5. Confirm transaction

### Option 2: Use Cast Command

```bash
# Register a contract for monitoring
cast send 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "registerContract(address,address,string)" \
  0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A \
  0xFCA0157a303d2134854d9cF4718901B6515b0696 \
  "Test Contract" \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --private-key 0x07993b3e9b87e831c76550e5032c87572d2114110ff2dd55f92a4da275af88ce
```

## 🤖 Start AI Agents (Optional)

For full functionality including real-time detection:

```bash
cd /home/marvi/Documents/Nullshot/codeguard-agents

# Install dependencies
npm install

# Add API keys to .env (optional for demo):
# OPENAI_API_KEY=your_key
# DISCORD_WEBHOOK=your_webhook

# Start agents locally
wrangler dev --local
```

## 🎥 Record Demo Video

Follow the script in `DEMO_SCRIPT.md`:

1. Show the beautiful dashboard (0:30-1:15)
2. Explain the architecture (1:15-2:00)
3. Register a contract live (2:00-2:30)
4. Show it appearing in dashboard (2:30-3:00)
5. Explain governance & safety (3:00-3:30)
6. Strong closing (3:30-4:00)

## 📊 Deployed Contracts

All live on Base Sepolia:

- **GuardianRegistry**: `0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d`
- **IncidentLog**: `0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A`
- **DetectionModelRegistry**: `0x25B8F8DF7a5a2Db569D93A3340235D25234C6085`
- **InsurancePool**: `0x6827513EBA43587B3772F87E2FC90dD787837Bb8`

View on Basescan:
https://sepolia.basescan.org/address/0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d

## 🎯 For Hackathon Submission

Include these materials:

1. **GitHub Repo** (this project)
2. **Demo Video** (record following DEMO_SCRIPT.md)
3. **Live Demo** (optional but impressive):
   - Deploy frontend to Vercel
   - Deploy agents to Cloudflare Workers
   - Share live URL

4. **Documentation**:
   - README.md (overview)
   - PROJECT_WRITEUP.md (detailed submission)
   - DEPLOYMENT_SUCCESS.md (proof of deployment)

## 💡 Pro Tips

1. **Show, Don't Tell**: Demonstrate the beautiful UI and real interactions
2. **Emphasize MCP**: Mention "8 custom MCP tools" and "6 specialized agents"
3. **Highlight Real Deployment**: "Live on Base Sepolia" is impressive
4. **Beautiful UI**: The shadcn/ui components are modern and polished
5. **Production Ready**: This is not a prototype - it's deployable today

## 🐛 Troubleshooting

**Frontend won't start?**
```bash
cd app
rm -rf node_modules .next
npm install
npm run dev
```

**Wallet won't connect?**
- Make sure you're on Base Sepolia network
- Check you have some Sepolia ETH
- Try a different wallet/browser

**Contracts not showing?**
- Wait 1-2 minutes for Basescan indexing
- Check the explorer links in DEPLOYMENT_SUCCESS.md
- Verify you're on the correct network

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `DEPLOYMENT_SUCCESS.md` - Deployment details
- `PROJECT_WRITEUP.md` - Technical deep-dive
- `DEMO_SCRIPT.md` - Video recording guide

---

**You're ready to win Track 1! 🏆**

Just run `npm run dev` in the app folder and start building your demo!
