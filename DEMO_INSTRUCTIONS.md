# 🎬 Live Demo Instructions

## Setup (Before Recording)

### 1. Start Dashboard
```bash
cd app
npm run dev
```
Open http://localhost:3000 - let it redirect to dashboard

### 2. Prepare Split Terminal
- **Left terminal**: Will show the "attack"
- **Right terminal**: Will show AI agents responding

### 3. Make Scripts Executable
```bash
chmod +x demo-attack.sh demo-agents.sh
```

## Recording the Demo (3-5 minutes)

### Part 1: Introduction (0:00 - 0:30)
**Screen:** Dashboard at http://localhost:3000/dashboard

**You say:**
> "Welcome to CodeGuard - an autonomous AI agent collective that protects DeFi protocols in real-time. 
> I'm showing you a dashboard monitoring 12 smart contracts on Base Sepolia. 
> Notice the risk scores, agent status indicators, and live incident feed."

**Show on screen:**
- Hover over risk gauges
- Show "Lending Protocol Gamma" with high risk score (95)
- Point out agent status (6 agents: Orchestrator, Monitor, Analyzer, etc.)

---

### Part 2: Architecture Overview (0:30 - 2:00)
**Screen:** Split between dashboard and terminal/code

**You say:**
> "CodeGuard uses 6 specialized AI agents working together:
> - **Monitor Agent** watches all transactions for anomalies
> - **Analyzer Agent** uses ML to identify vulnerabilities
> - **Threat Intel** searches 500+ historical exploits
> - **Response Agent** executes emergency actions
> - **Learning Agent** improves from each incident
> - **Orchestrator** coordinates everything
> 
> They communicate via 8 custom MCP tools for bytecode analysis, 
> blockchain monitoring, and real-time alerts."

**Show on screen:**
- Briefly show `codeguard-agents/` folder structure
- Maybe show a snippet of agent code (orchestrator/index.ts)
- Show deployed contracts on Basescan: https://sepolia.basescan.org/address/0x8269021cfdeb00B5F59a85fF31281A1D73bcDE6d

---

### Part 3: Live Attack Demo (2:00 - 4:00) ⭐ THE MAIN EVENT

**Screen:** Split terminal view

**Setup:**
```bash
# Left terminal
./demo-attack.sh

# Right terminal  
./demo-agents.sh
```

**IMPORTANT:** Start BOTH scripts at the same time (or right terminal 1 second after left)

**You narrate while scripts run:**

> [0:00] "Now for the exciting part - let's simulate a re-entrancy attack on a vulnerable DeFi contract."

> [Scripts start running]

> [0:03] "3 seconds - the Monitor Agent detects unusual gas patterns..."

> [0:05] "5 seconds - the Analyzer identifies it's a re-entrancy vulnerability with 98% confidence..."

> [0:07] "7 seconds - Threat Intel finds a 98% match to the Cream Finance exploit that stole $34 million in 2021..."

> [0:09] "9 seconds - the Response Agent executes an emergency pause. The contract is frozen."

> [Wait for scripts to finish - about 20 seconds total]

> "That's it. From detection to protection in just 9 seconds. Completely autonomous. No human intervention needed."

---

### Part 4: Dashboard Update (4:00 - 4:30)

**Screen:** Switch back to dashboard, refresh page

**You say:**
> "Look at the dashboard now - you can see the incident logged in real-time:
> - Contract address
> - Threat type: Re-entrancy  
> - Risk score: 95 (Critical)
> - Status: Paused
> - The incident is permanently stored onchain via our IncidentLog contract."

**Show on screen:**
- Point to "Lending Protocol Gamma" now showing PAUSED status
- Scroll through incident feed (if visible)
- Maybe click "View on Basescan" to show the real deployed contract

---

### Part 5: Wrap-up (4:30 - 5:00)

**Screen:** Back to dashboard overview

**You say:**
> "CodeGuard demonstrates the power of AI agent collectives in Web3 security:
> - 6 specialized agents working in perfect coordination
> - 8 custom MCP tools for blockchain analysis
> - Fully deployed on Base Sepolia with verified contracts
> - Real-time detection and autonomous response
> - Complete audit trail onchain
> 
> This is the future of smart contract security - autonomous, intelligent, and always watching.
> 
> Built for NullShot Hacks Season 0, Track 1. Thank you!"

---

## Tips for a Great Recording

### Visual Polish
- **Font size:** Zoom in terminal (Ctrl/Cmd + Plus) so text is readable
- **Clean desktop:** Close unnecessary windows
- **Dark theme:** Easier on eyes, looks more professional
- **Browser zoom:** Make dashboard elements bigger (Ctrl/Cmd + Plus)

### Narration
- **Speak clearly** and at moderate pace
- **Pause** after saying timestamps (3s, 5s, 7s, 9s) to let viewers see
- **Enthusiasm!** You built something amazing - show excitement
- **Practice once** before final recording

### Common Issues
- Scripts not executable? Run `chmod +x demo-attack.sh demo-agents.sh`
- Wrong timing? Scripts are synchronized - just start them together
- Dashboard not updating? That's okay - the mock "Lending Protocol Gamma" already shows paused state

### Screen Recording Tools
- **Mac:** QuickTime (Cmd+Shift+5) or OBS
- **Linux:** OBS Studio or SimpleScreenRecorder  
- **Windows:** OBS Studio or Xbox Game Bar

### Export Settings
- **Resolution:** 1920x1080 (1080p)
- **Format:** MP4
- **Duration:** 3-5 minutes (judges prefer shorter!)

---

## Quick Test Run

Before recording, do a practice run:

```bash
# Terminal 1 (left)
./demo-attack.sh

# Terminal 2 (right) - start 1 second after left
sleep 1 && ./demo-agents.sh
```

Make sure:
- ✅ Scripts run without errors
- ✅ Colors display correctly  
- ✅ Timing feels natural (scripts are synchronized)
- ✅ You can see the text clearly
- ✅ Dashboard is visible and looks good

---

## 🎬 You're Ready!

The scripts will handle all the timing and visual effects. Your job is to:
1. Start both scripts at the same time
2. Narrate the timeline (3s, 5s, 7s, 9s)
3. Show enthusiasm
4. Point out key features on the dashboard

**Good luck! You're going to crush this demo! 🚀**
