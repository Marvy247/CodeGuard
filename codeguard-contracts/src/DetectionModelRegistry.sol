// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DetectionModelRegistry
 * @notice Version-controlled registry of AI detection models stored on IPFS
 * @dev Enables transparent model evolution with community governance
 */
contract DetectionModelRegistry is Ownable {
    struct ModelVersion {
        string ipfsHash;
        uint256 version;
        uint256 accuracy;
        uint256 falsePositiveRate;
        uint256 timestamp;
        address proposer;
        bool isActive;
        string description;
    }
    
    ModelVersion[] public models;
    uint256 public activeModelIndex;
    
    event ModelProposed(
        uint256 indexed version,
        string ipfsHash,
        address indexed proposer,
        uint256 accuracy,
        uint256 timestamp
    );
    
    event ModelActivated(
        uint256 indexed version,
        string ipfsHash,
        uint256 timestamp
    );
    
    event ModelPerformanceUpdated(
        uint256 indexed version,
        uint256 accuracy,
        uint256 falsePositiveRate,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    function proposeModel(
        string memory _ipfsHash,
        uint256 _accuracy,
        uint256 _falsePositiveRate,
        string memory _description
    ) external onlyOwner returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(_accuracy <= 10000, "Accuracy must be in basis points (0-10000)");
        require(_falsePositiveRate <= 10000, "FPR must be in basis points");
        
        uint256 version = models.length;
        
        ModelVersion memory newModel = ModelVersion({
            ipfsHash: _ipfsHash,
            version: version,
            accuracy: _accuracy,
            falsePositiveRate: _falsePositiveRate,
            timestamp: block.timestamp,
            proposer: msg.sender,
            isActive: false,
            description: _description
        });
        
        models.push(newModel);
        
        emit ModelProposed(version, _ipfsHash, msg.sender, _accuracy, block.timestamp);
        
        return version;
    }
    
    function activateModel(uint256 _version) external onlyOwner {
        require(_version < models.length, "Invalid model version");
        
        if (models.length > 0 && models[activeModelIndex].isActive) {
            models[activeModelIndex].isActive = false;
        }
        
        models[_version].isActive = true;
        activeModelIndex = _version;
        
        emit ModelActivated(_version, models[_version].ipfsHash, block.timestamp);
    }
    
    function updateModelPerformance(
        uint256 _version,
        uint256 _accuracy,
        uint256 _falsePositiveRate
    ) external onlyOwner {
        require(_version < models.length, "Invalid model version");
        require(_accuracy <= 10000, "Accuracy must be in basis points");
        require(_falsePositiveRate <= 10000, "FPR must be in basis points");
        
        ModelVersion storage model = models[_version];
        model.accuracy = _accuracy;
        model.falsePositiveRate = _falsePositiveRate;
        
        emit ModelPerformanceUpdated(_version, _accuracy, _falsePositiveRate, block.timestamp);
    }
    
    function getActiveModel() external view returns (ModelVersion memory) {
        require(models.length > 0, "No models registered");
        return models[activeModelIndex];
    }
    
    function getModel(uint256 _version) external view returns (ModelVersion memory) {
        require(_version < models.length, "Invalid model version");
        return models[_version];
    }
    
    function getTotalModels() external view returns (uint256) {
        return models.length;
    }
    
    function getAllModels() external view returns (ModelVersion[] memory) {
        return models;
    }
}
