// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GuardianRegistry
 * @notice Core registry of protected contracts with emergency pause capability
 * @dev AI agents with GUARDIAN_ROLE can pause contracts when vulnerabilities detected
 */
contract GuardianRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    
    struct ProtectedContract {
        address contractAddress;
        address guardian;
        uint256 riskScore;
        bool isPaused;
        uint256 lastCheckTimestamp;
        uint256 pausedAt;
        string protocolName;
    }
    
    mapping(address => ProtectedContract) public protectedContracts;
    mapping(address => bool) public isProtected;
    address[] public allProtectedContracts;
    
    uint256 public constant PAUSE_COOLDOWN = 5 minutes;
    uint256 public constant MAX_PAUSES_PER_HOUR = 10;
    uint256 public pauseCount;
    uint256 public lastPauseHourReset;
    
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
    
    event ContractResumed(
        address indexed contractAddress,
        address indexed dao,
        uint256 timestamp
    );
    
    event RiskScoreUpdated(
        address indexed contractAddress,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DAO_ROLE, msg.sender);
        lastPauseHourReset = block.timestamp;
    }
    
    function registerContract(
        address _contractAddress,
        address _guardian,
        string memory _protocolName
    ) external {
        require(_contractAddress != address(0), "Invalid contract address");
        require(_guardian != address(0), "Invalid guardian address");
        require(!isProtected[_contractAddress], "Contract already protected");
        require(hasRole(GUARDIAN_ROLE, _guardian), "Guardian not authorized");
        
        protectedContracts[_contractAddress] = ProtectedContract({
            contractAddress: _contractAddress,
            guardian: _guardian,
            riskScore: 0,
            isPaused: false,
            lastCheckTimestamp: block.timestamp,
            pausedAt: 0,
            protocolName: _protocolName
        });
        
        isProtected[_contractAddress] = true;
        allProtectedContracts.push(_contractAddress);
        
        emit ContractRegistered(_contractAddress, _guardian, _protocolName, block.timestamp);
    }
    
    function emergencyPause(
        address _contractAddress,
        string memory _reason,
        uint256 _riskScore
    ) external onlyRole(GUARDIAN_ROLE) nonReentrant {
        require(isProtected[_contractAddress], "Contract not protected");
        ProtectedContract storage pc = protectedContracts[_contractAddress];
        require(!pc.isPaused, "Contract already paused");
        require(
            block.timestamp >= pc.pausedAt + PAUSE_COOLDOWN,
            "Pause cooldown active"
        );
        
        if (block.timestamp >= lastPauseHourReset + 1 hours) {
            pauseCount = 0;
            lastPauseHourReset = block.timestamp;
        }
        require(pauseCount < MAX_PAUSES_PER_HOUR, "Pause rate limit exceeded");
        
        pc.isPaused = true;
        pc.pausedAt = block.timestamp;
        pc.riskScore = _riskScore;
        pc.lastCheckTimestamp = block.timestamp;
        pauseCount++;
        
        emit EmergencyPause(_contractAddress, msg.sender, _reason, _riskScore, block.timestamp);
    }
    
    function resumeContract(address _contractAddress) external onlyRole(DAO_ROLE) {
        require(isProtected[_contractAddress], "Contract not protected");
        ProtectedContract storage pc = protectedContracts[_contractAddress];
        require(pc.isPaused, "Contract not paused");
        require(
            block.timestamp >= pc.pausedAt + 24 hours,
            "24h timelock active"
        );
        
        pc.isPaused = false;
        pc.riskScore = 0;
        
        emit ContractResumed(_contractAddress, msg.sender, block.timestamp);
    }
    
    function updateRiskScore(
        address _contractAddress,
        uint256 _riskScore
    ) external onlyRole(GUARDIAN_ROLE) {
        require(isProtected[_contractAddress], "Contract not protected");
        require(_riskScore <= 100, "Risk score must be <= 100");
        
        ProtectedContract storage pc = protectedContracts[_contractAddress];
        uint256 oldScore = pc.riskScore;
        pc.riskScore = _riskScore;
        pc.lastCheckTimestamp = block.timestamp;
        
        emit RiskScoreUpdated(_contractAddress, oldScore, _riskScore, block.timestamp);
    }
    
    function getAllProtectedContracts() external view returns (address[] memory) {
        return allProtectedContracts;
    }
    
    function isContractPaused(address _contractAddress) external view returns (bool) {
        return protectedContracts[_contractAddress].isPaused;
    }
    
    function getContractDetails(address _contractAddress)
        external
        view
        returns (ProtectedContract memory)
    {
        require(isProtected[_contractAddress], "Contract not protected");
        return protectedContracts[_contractAddress];
    }
    
    function authorizeGuardian(address _agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GUARDIAN_ROLE, _agent);
    }
    
    function revokeGuardian(address _agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(GUARDIAN_ROLE, _agent);
    }
}
