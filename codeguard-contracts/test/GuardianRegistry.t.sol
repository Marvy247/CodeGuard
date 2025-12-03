// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GuardianRegistry.sol";

contract GuardianRegistryTest is Test {
    GuardianRegistry public registry;
    address public admin;
    address public guardian;
    address public dao;
    address public testContract;
    
    event ContractRegistered(
        address indexed contractAddress,
        address indexed guardian,
        string protocolName,
        uint256 timestamp
    );
    
    event EmergencyPause(
        address indexed contractAddress,
        address indexed guardian,
        string reason,
        uint256 riskScore,
        uint256 timestamp
    );
    
    function setUp() public {
        admin = address(this);
        guardian = makeAddr("guardian");
        dao = makeAddr("dao");
        testContract = makeAddr("testContract");
        
        registry = new GuardianRegistry();
        registry.authorizeGuardian(guardian);
        registry.grantRole(registry.DAO_ROLE(), dao);
    }
    
    function testRegisterContract() public {
        vm.expectEmit(true, true, false, true);
        emit ContractRegistered(testContract, guardian, "Test Protocol", block.timestamp);
        
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        assertTrue(registry.isProtected(testContract));
        
        GuardianRegistry.ProtectedContract memory pc = registry.getContractDetails(testContract);
        assertEq(pc.contractAddress, testContract);
        assertEq(pc.guardian, guardian);
        assertEq(pc.riskScore, 0);
        assertFalse(pc.isPaused);
    }
    
    function testEmergencyPause() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.prank(guardian);
        vm.expectEmit(true, true, false, true);
        emit EmergencyPause(testContract, guardian, "Reentrancy detected", 95, block.timestamp);
        
        registry.emergencyPause(testContract, "Reentrancy detected", 95);
        
        assertTrue(registry.isContractPaused(testContract));
        
        GuardianRegistry.ProtectedContract memory pc = registry.getContractDetails(testContract);
        assertEq(pc.riskScore, 95);
        assertTrue(pc.isPaused);
    }
    
    function testCannotPauseTwice() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.startPrank(guardian);
        registry.emergencyPause(testContract, "Reentrancy detected", 95);
        
        vm.expectRevert("Contract already paused");
        registry.emergencyPause(testContract, "Another issue", 90);
        vm.stopPrank();
    }
    
    function testPauseCooldown() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.startPrank(guardian);
        registry.emergencyPause(testContract, "Issue 1", 95);
        vm.stopPrank();
        
        vm.startPrank(dao);
        vm.warp(block.timestamp + 24 hours + 1);
        registry.resumeContract(testContract);
        vm.stopPrank();
        
        vm.startPrank(guardian);
        vm.warp(block.timestamp + 1);
        vm.expectRevert("Pause cooldown active");
        registry.emergencyPause(testContract, "Issue 2", 90);
        vm.stopPrank();
    }
    
    function testResumeContract() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.prank(guardian);
        registry.emergencyPause(testContract, "Reentrancy detected", 95);
        
        vm.warp(block.timestamp + 24 hours + 1);
        
        vm.prank(dao);
        registry.resumeContract(testContract);
        
        assertFalse(registry.isContractPaused(testContract));
        
        GuardianRegistry.ProtectedContract memory pc = registry.getContractDetails(testContract);
        assertEq(pc.riskScore, 0);
    }
    
    function testCannotResumeBeforeTimelock() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.prank(guardian);
        registry.emergencyPause(testContract, "Reentrancy detected", 95);
        
        vm.prank(dao);
        vm.expectRevert("24h timelock active");
        registry.resumeContract(testContract);
    }
    
    function testUpdateRiskScore() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        vm.prank(guardian);
        registry.updateRiskScore(testContract, 75);
        
        GuardianRegistry.ProtectedContract memory pc = registry.getContractDetails(testContract);
        assertEq(pc.riskScore, 75);
    }
    
    function testGetAllProtectedContracts() public {
        address contract1 = makeAddr("contract1");
        address contract2 = makeAddr("contract2");
        
        registry.registerContract(contract1, guardian, "Protocol 1");
        registry.registerContract(contract2, guardian, "Protocol 2");
        
        address[] memory contracts = registry.getAllProtectedContracts();
        assertEq(contracts.length, 2);
        assertEq(contracts[0], contract1);
        assertEq(contracts[1], contract2);
    }
    
    function testOnlyGuardianCanPause() public {
        registry.registerContract(testContract, guardian, "Test Protocol");
        
        address attacker = makeAddr("attacker");
        vm.prank(attacker);
        vm.expectRevert();
        registry.emergencyPause(testContract, "Malicious pause", 100);
    }
}
