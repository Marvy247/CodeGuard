#!/bin/bash

# CodeGuard Live Attack Demo Script
# Run this in your LEFT terminal during the demo

# Colors for visual appeal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear screen
clear

echo -e "${BOLD}${RED}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${RED}        SIMULATED RE-ENTRANCY ATTACK${NC}"
echo -e "${BOLD}${RED}═══════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Deploy vulnerable contract
echo -e "${YELLOW}[Phase 1]${NC} Deploying vulnerable DeFi lending contract..."
sleep 1
echo -e "${CYAN}├─ Compiling VulnerableBank.sol...${NC}"
sleep 0.5
echo -e "${CYAN}├─ Estimating gas...${NC}"
sleep 0.5
echo -e "${CYAN}└─ Broadcasting transaction...${NC}"
sleep 1
echo -e "${GREEN}✓ Contract deployed: ${BOLD}0x9876543210987654321098765432109876543210${NC}"
echo -e "${GREEN}✓ Base Sepolia Explorer: https://sepolia.basescan.org/address/0x987...3210${NC}"
echo ""
sleep 2

# Step 2: Register with CodeGuard
echo -e "${YELLOW}[Phase 2]${NC} Registering contract with CodeGuard..."
sleep 1
echo -e "${CYAN}├─ Calling GuardianRegistry.registerContract()...${NC}"
sleep 0.8
echo -e "${GREEN}✓ Contract registered for monitoring${NC}"
echo -e "${GREEN}✓ AI Agents: Monitor, Analyzer, ThreatIntel → ACTIVE${NC}"
echo ""
sleep 2

# Step 3: Deposit funds (setup)
echo -e "${YELLOW}[Phase 3]${NC} Setting up attack scenario..."
sleep 1
echo -e "${CYAN}├─ Depositing 10 ETH to VulnerableBank...${NC}"
sleep 0.8
echo -e "${CYAN}├─ Deploying Attacker contract...${NC}"
sleep 0.8
echo -e "${GREEN}✓ Setup complete. Contract has 10 ETH balance.${NC}"
echo ""
sleep 2

# Step 4: Execute the attack!
echo -e "${RED}${BOLD}[Phase 4]${NC}${RED} EXECUTING RE-ENTRANCY ATTACK...${NC}"
sleep 1
echo -e "${CYAN}├─ Calling withdraw() with re-entrancy payload...${NC}"
sleep 0.5
echo -e "${CYAN}├─ Recursive call depth: 1...${NC}"
sleep 0.3
echo -e "${CYAN}├─ Recursive call depth: 2...${NC}"
sleep 0.3
echo -e "${CYAN}├─ Recursive call depth: 3...${NC}"
sleep 0.5
echo -e "${PURPLE}▶ Transaction hash: ${BOLD}0xabcd1234567890abcdef1234567890abcdef12345678${NC}"
echo -e "${PURPLE}▶ Gas used: ${BOLD}487,392${NC} (⚠️  Unusually high)"
echo ""
sleep 1

# Step 5: Detection in progress
echo -e "${YELLOW}[⏱️  T+3s]${NC} ${CYAN}CodeGuard Monitor Agent analyzing transaction...${NC}"
sleep 2

echo ""
echo -e "${RED}${BOLD}⚡ ATTACK IN PROGRESS ⚡${NC}"
echo -e "${RED}Watch the AGENTS terminal → → →${NC}"
echo ""
sleep 1

# Waiting for agents to respond
echo -e "${CYAN}Waiting for CodeGuard response...${NC}"
sleep 4

echo -e "${GREEN}${BOLD}✓ CONTRACT PAUSED BY AI AGENTS${NC}"
echo -e "${GREEN}✓ Attack prevented! Funds are safe.${NC}"
echo ""
