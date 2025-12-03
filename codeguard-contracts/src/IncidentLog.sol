// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IncidentLog
 * @notice Immutable log of all security incidents detected by AI agents
 * @dev Provides permanent audit trail of all threats and responses
 */
contract IncidentLog is Ownable {
    struct Incident {
        uint256 id;
        address contractAddress;
        uint256 timestamp;
        string incidentType;
        uint256 riskScore;
        string ipfsReport;
        address detectedBy;
        bool wasExploit;
        bool resolved;
        uint256 resolvedAt;
    }
    
    Incident[] public incidents;
    mapping(address => uint256[]) public contractIncidents;
    mapping(address => uint256) public agentDetectionCount;
    
    event IncidentLogged(
        uint256 indexed incidentId,
        address indexed contractAddress,
        string incidentType,
        uint256 riskScore,
        address indexed detectedBy,
        uint256 timestamp
    );
    
    event IncidentResolved(
        uint256 indexed incidentId,
        bool wasExploit,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    function logIncident(
        address _contractAddress,
        string memory _incidentType,
        uint256 _riskScore,
        string memory _ipfsReport,
        address _detectedBy
    ) external onlyOwner returns (uint256) {
        require(_contractAddress != address(0), "Invalid contract address");
        require(_detectedBy != address(0), "Invalid detector address");
        require(_riskScore <= 100, "Risk score must be <= 100");
        
        uint256 incidentId = incidents.length;
        
        Incident memory newIncident = Incident({
            id: incidentId,
            contractAddress: _contractAddress,
            timestamp: block.timestamp,
            incidentType: _incidentType,
            riskScore: _riskScore,
            ipfsReport: _ipfsReport,
            detectedBy: _detectedBy,
            wasExploit: false,
            resolved: false,
            resolvedAt: 0
        });
        
        incidents.push(newIncident);
        contractIncidents[_contractAddress].push(incidentId);
        agentDetectionCount[_detectedBy]++;
        
        emit IncidentLogged(
            incidentId,
            _contractAddress,
            _incidentType,
            _riskScore,
            _detectedBy,
            block.timestamp
        );
        
        return incidentId;
    }
    
    function resolveIncident(
        uint256 _incidentId,
        bool _wasExploit
    ) external onlyOwner {
        require(_incidentId < incidents.length, "Invalid incident ID");
        Incident storage incident = incidents[_incidentId];
        require(!incident.resolved, "Incident already resolved");
        
        incident.resolved = true;
        incident.wasExploit = _wasExploit;
        incident.resolvedAt = block.timestamp;
        
        emit IncidentResolved(_incidentId, _wasExploit, block.timestamp);
    }
    
    function getIncident(uint256 _incidentId) external view returns (Incident memory) {
        require(_incidentId < incidents.length, "Invalid incident ID");
        return incidents[_incidentId];
    }
    
    function getContractIncidents(address _contractAddress) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return contractIncidents[_contractAddress];
    }
    
    function getTotalIncidents() external view returns (uint256) {
        return incidents.length;
    }
    
    function getAgentStats(address _agent) external view returns (uint256) {
        return agentDetectionCount[_agent];
    }
    
    function getRecentIncidents(uint256 _count) 
        external 
        view 
        returns (Incident[] memory) 
    {
        uint256 total = incidents.length;
        uint256 count = _count > total ? total : _count;
        Incident[] memory recent = new Incident[](count);
        
        for (uint256 i = 0; i < count; i++) {
            recent[i] = incidents[total - 1 - i];
        }
        
        return recent;
    }
}
