# 🎉 Deployment Successful!

## Smart Contracts Deployed to Base Sepolia

### Contract Addresses

| Contract | Address | Explorer |
|----------|---------|----------|
| **GuardianRegistry** | `0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d` | [View](https://sepolia.basescan.org/address/0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d) |
| **IncidentLog** | `0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A` | [View](https://sepolia.basescan.org/address/0x23d549C8Ad022bDDF9B524Cd9918aafa9Bf7103A) |
| **DetectionModelRegistry** | `0x25B8F8DF7a5a2Db569D93A3340235D25234C6085` | [View](https://sepolia.basescan.org/address/0x25B8F8DF7a5a2Db569D93A3340235D25234C6085) |
| **InsurancePool** | `0x6827513EBA43587B3772F87E2FC90dD787837Bb8` | [View](https://sepolia.basescan.org/address/0x6827513EBA43587B3772F87E2FC90dD787837Bb8) |

### Deployment Details

- **Network**: Base Sepolia (Chain ID: 84532)
- **Deployer**: `0xFCA0157a303d2134854d9cF4718901B6515b0696`
- **Agent Address**: `0xFCA0157a303d2134854d9cF4718901B6515b0696`
- **RPC URL**: `https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J`
- **Status**: ✅ **SUCCESSFUL**

### What Was Deployed

1. **GuardianRegistry**
   - Main registry for protected contracts
   - Emergency pause mechanism
   - Agent authorization system
   - Initial model proposed and activated

2. **IncidentLog**
   - Immutable incident records
   - Event logging for all threats
   - Agent performance tracking

3. **DetectionModelRegistry**
   - AI model versioning on IPFS
   - Initial model v1 activated (90% accuracy, 5% FPR)
   - Community governance ready

4. **InsurancePool**
   - Stake-based insurance system
   - Claims management
   - Reward distribution

### Integration Status

✅ **Smart Contracts** - Deployed to Base Sepolia  
✅ **ABIs Generated** - Located in `app/src/lib/abis/`  
✅ **Frontend Config** - Updated with contract addresses  
✅ **Agent Config** - Updated with contract addresses  
✅ **Environment Files** - All .env files configured  

### Next Steps

#### 1. Authorize the Agent as Guardian

The agent needs GUARDIAN_ROLE to pause contracts:

```bash
# Option A: Using cast (Foundry)
cast send 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
  "authorizeGuardian(address)" \
  0xFCA0157a303d2134854d9cF4718901B6515b0696 \
  --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J \
  --private-key 0x07993b3e9b87e831c76550e5032c87572d2114110ff2dd55f92a4da275af88ce

# Option B: Already done during deployment! ✅
# The agent was authorized automatically in the deployment script
```

#### 2. Start the Frontend

```bash
cd app
npm install
npm run dev
# Open http://localhost:3000/dashboard
```

#### 3. Start the Agents (Optional - for full functionality)

```bash
cd codeguard-agents
npm install

# Add your API keys to .env:
# - OPENAI_API_KEY
# - DISCORD_WEBHOOK (optional)
# - TELEGRAM_BOT_TOKEN (optional)

wrangler dev --local
```

#### 4. Register Your First Contract

1. Visit dashboard at `http://localhost:3000/dashboard`
2. Connect your wallet (make sure you're on Base Sepolia)
3. Click "Register Contract"
4. Enter a contract address you want to protect
5. Confirm the transaction
6. Watch the AI agents start monitoring!

### Verify Deployment

You can verify the contracts are live by:

1. **Check on Basescan**: Visit the explorer links above
2. **Read Contract State**:
   ```bash
   # Check GuardianRegistry
   cast call 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
     "pauseCount()(uint256)" \
     --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
   
   # Check if agent is authorized
   cast call 0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d \
     "hasRole(bytes32,address)(bool)" \
     0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3 \
     0xFCA0157a303d2134854d9cF4718901B6515b0696 \
     --rpc-url https://base-sepolia.g.alchemy.com/v2/H--HtDpZlgQ0zxKBt7zBC-DzXtxGRL0J
   ```

### Testing the System

#### Test Scenario: Register and Monitor a Contract

1. **Find a test contract** on Base Sepolia (or deploy your own)
2. **Register it** via the frontend
3. **View it** in the dashboard with risk score
4. **Monitor** the live incident feed for any anomalies

#### Test Scenario: Emergency Pause (Advanced)

1. Deploy a vulnerable contract with re-entrancy
2. Register it with CodeGuard
3. Trigger the exploit
4. Watch the agent detect and pause it automatically

### Files Updated

All configuration files have been updated with the deployed addresses:

- ✅ `app/.env.local` - Frontend environment variables
- ✅ `app/src/lib/constants/contracts.ts` - Contract address constants
- ✅ `codeguard-agents/.env` - Agent environment variables
- ✅ `codeguard-contracts/deployments.txt` - Deployment record

### ABIs Generated

The following ABI files are ready for frontend use:

- ✅ `app/src/lib/abis/GuardianRegistry.json`
- ✅ `app/src/lib/abis/IncidentLog.json`
- ✅ `app/src/lib/abis/DetectionModelRegistry.json`
- ✅ `app/src/lib/abis/InsurancePool.json`

### Gas Used

- GuardianRegistry: ~1,262,172 gas
- IncidentLog: ~1,087,260 gas
- DetectionModelRegistry: ~1,058,434 gas
- InsurancePool: ~1,244,793 gas
- Model Initialization: ~162,664 gas
- **Total**: ~4,815,323 gas

### Troubleshooting

**If contracts don't appear on Basescan:**
- Wait 1-2 minutes for indexing
- Check transaction in broadcast folder: `broadcast/Deploy.s.sol/84532/run-latest.json`
- Verify network is Base Sepolia (Chain ID: 84532)

**If frontend can't connect:**
- Ensure `.env.local` has correct addresses
- Make sure you're on Base Sepolia network in your wallet
- Check console for any errors

**If agents can't interact:**
- Verify agent is authorized: Check `hasRole` call above
- Ensure `.env` has correct private key and contract addresses
- Check RPC URL is accessible

---

## 🎉 You're Ready to Demo!

Your CodeGuard project is now fully deployed and ready for the hackathon demo. All contracts are live on Base Sepolia and integrated with the frontend.

### Quick Demo Commands

```bash
# Terminal 1: Frontend
cd app && npm run dev

# Terminal 2: Agents (optional)
cd codeguard-agents && wrangler dev --local

# Browser: Visit
http://localhost:3000/dashboard
```

**Good luck with your submission! 🚀**
