#!/bin/bash

# CodeGuard AI Agents Response Demo Script
# Run this in your RIGHT terminal during the demo

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Clear screen
clear

echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}        CODEGUARD AI AGENTS - LIVE MONITORING${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Initial status
echo -e "${GREEN}[Orchestrator]${NC} System initialized. 6 agents active."
echo -e "${GREEN}[Orchestrator]${NC} Monitoring 12 contracts on Base Sepolia..."
echo -e "${CYAN}[Monitor]${NC} Listening for transactions..."
echo -e "${CYAN}[Analyzer]${NC} AI models loaded. Ready."
echo -e "${CYAN}[ThreatIntel]${NC} Vector DB: 500+ known exploits indexed."
echo ""
echo -e "${YELLOW}⏳ Waiting for activity...${NC}"
echo ""

# Wait for attack to start (sync with left terminal)
sleep 14

# T+3s: Monitor detects
echo -e "${YELLOW}[⏱️  T+3s]${NC} ${BOLD}${RED}━━━ UNUSUAL ACTIVITY DETECTED ━━━${NC}"
echo -e "${RED}[Monitor Agent]${NC} ⚠️  Anomaly on contract 0x9876...3210"
echo -e "${RED}[Monitor]${NC} └─ Gas usage: 487,392 (3.2x normal for withdraw)"
echo -e "${RED}[Monitor]${NC} └─ External call pattern: SUSPICIOUS"
echo -e "${RED}[Monitor]${NC} └─ State change order: ⚠️  AFTER external call"
echo -e "${YELLOW}[Monitor]${NC} Escalating to Analyzer Agent..."
echo ""
sleep 2

# T+5s: Analyzer identifies vulnerability
echo -e "${YELLOW}[⏱️  T+5s]${NC} ${BOLD}${PURPLE}━━━ VULNERABILITY ANALYSIS ━━━${NC}"
echo -e "${PURPLE}[Analyzer Agent]${NC} Running bytecode analysis..."
echo -e "${PURPLE}[Analyzer]${NC} └─ Pattern: Re-entrancy vulnerability detected"
echo -e "${PURPLE}[Analyzer]${NC} └─ Confidence: ${BOLD}98.4%${NC}"
echo -e "${PURPLE}[Analyzer]${NC} └─ Risk Score: ${BOLD}${RED}95/100 (CRITICAL)${NC}"
echo -e "${PURPLE}[Analyzer]${NC} └─ Impact: Full contract balance at risk (~10 ETH)"
echo -e "${YELLOW}[Analyzer]${NC} Querying Threat Intelligence..."
echo ""
sleep 2

# T+7s: Threat Intel finds match
echo -e "${YELLOW}[⏱️  T+7s]${NC} ${BOLD}${CYAN}━━━ THREAT INTELLIGENCE MATCH ━━━${NC}"
echo -e "${CYAN}[ThreatIntel Agent]${NC} Searching exploit database..."
echo -e "${CYAN}[ThreatIntel]${NC} └─ ${BOLD}Match found: Cream Finance exploit (Aug 2021)${NC}"
echo -e "${CYAN}[ThreatIntel]${NC} └─ Similarity: 98.2%"
echo -e "${CYAN}[ThreatIntel]${NC} └─ Historical impact: $34M stolen"
echo -e "${CYAN}[ThreatIntel]${NC} └─ Attack vector: withdraw() re-entrancy"
echo -e "${RED}[ThreatIntel]${NC} ${BOLD}⚠️  CRITICAL THREAT CONFIRMED${NC}"
echo -e "${YELLOW}[Orchestrator]${NC} Activating Response Agent..."
echo ""
sleep 2

# T+9s: Response Agent acts
echo -e "${YELLOW}[⏱️  T+9s]${NC} ${BOLD}${GREEN}━━━ EMERGENCY RESPONSE INITIATED ━━━${NC}"
echo -e "${GREEN}[Response Agent]${NC} ${BOLD}Executing emergency pause protocol...${NC}"
echo -e "${GREEN}[Response]${NC} └─ Calling GuardianRegistry.emergencyPause()"
echo -e "${GREEN}[Response]${NC} └─ Contract: 0x9876...3210"
echo -e "${GREEN}[Response]${NC} └─ Reason: 'Re-entrancy attack detected (Cream Finance pattern)'"
sleep 1
echo -e "${GREEN}[Response]${NC} └─ Transaction sent..."
sleep 1
echo -e "${GREEN}${BOLD}[Response]${NC} ✓ Tx confirmed: 0xdef567890abcdef567890abcdef567890abcd${NC}"
echo -e "${GREEN}${BOLD}[Response]${NC} ✓ CONTRACT SUCCESSFULLY PAUSED${NC}"
echo ""

# Incident logging and alerts
echo -e "${BLUE}[Response]${NC} Logging incident onchain..."
echo -e "${BLUE}[Response]${NC} └─ IncidentLog.logIncident() confirmed"
echo -e "${BLUE}[Response]${NC} └─ Incident ID: #0x7a3b9c..."
echo -e "${BLUE}[Response]${NC} └─ IPFS report: ipfs://QmX4Yt..."
sleep 1
echo ""
echo -e "${PURPLE}[Notification Agent]${NC} Sending alerts..."
echo -e "${PURPLE}[Notification]${NC} └─ Discord webhook: ✓ Sent"
echo -e "${PURPLE}[Notification]${NC} └─ Telegram bot: ✓ Sent"
echo -e "${PURPLE}[Notification]${NC} └─ Dashboard WebSocket: ✓ Updated"
echo ""
sleep 1

# Success summary
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}        ✓ ATTACK PREVENTED - FUNDS SECURED${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Response Timeline:${NC}"
echo -e "  ${YELLOW}T+3s${NC} → Monitor detected anomaly"
echo -e "  ${YELLOW}T+5s${NC} → Analyzer identified re-entrancy (98% confidence)"
echo -e "  ${YELLOW}T+7s${NC} → Threat Intel matched Cream Finance exploit"
echo -e "  ${YELLOW}T+9s${NC} → Response Agent paused contract"
echo -e "  ${GREEN}${BOLD}Total: 9 seconds from detection to protection${NC}"
echo ""
echo -e "${BLUE}Next:${NC} Check the dashboard → Incident feed shows full details"
echo ""
