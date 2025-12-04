// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GuardianRegistry.sol";
import "../src/IncidentLog.sol";
import "../src/DetectionModelRegistry.sol";
import "../src/InsurancePool.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with address:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy GuardianRegistry
        GuardianRegistry guardianRegistry = new GuardianRegistry();
        console.log("GuardianRegistry deployed at:", address(guardianRegistry));
        
        // Deploy IncidentLog
        IncidentLog incidentLog = new IncidentLog();
        console.log("IncidentLog deployed at:", address(incidentLog));
        
        // Deploy DetectionModelRegistry
        DetectionModelRegistry modelRegistry = new DetectionModelRegistry();
        console.log("DetectionModelRegistry deployed at:", address(modelRegistry));
        
        // Deploy InsurancePool
        InsurancePool insurancePool = new InsurancePool();
        console.log("InsurancePool deployed at:", address(insurancePool));
        
        // Setup: Authorize agent as guardian
        address agentAddress = vm.envOr("AGENT_ADDRESS", address(0));
        if (agentAddress != address(0)) {
            guardianRegistry.authorizeGuardian(agentAddress);
            console.log("Authorized agent as guardian:", agentAddress);
        }
        
        // Propose initial detection model
        string memory initialModelHash = "QmInitialModel123"; // Placeholder
        modelRegistry.proposeModel(
            initialModelHash,
            9000, // 90% accuracy
            500,  // 5% false positive rate
            "Initial detection model v1"
        );
        modelRegistry.activateModel(0);
        console.log("Initial model proposed and activated");
        
        vm.stopBroadcast();
        
        // Log deployment addresses
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Copy these addresses:");
        console.log("GUARDIAN_REGISTRY=", address(guardianRegistry));
        console.log("INCIDENT_LOG=", address(incidentLog));
        console.log("MODEL_REGISTRY=", address(modelRegistry));
        console.log("INSURANCE_POOL=", address(insurancePool));
        console.log("==========================");
    }
}
