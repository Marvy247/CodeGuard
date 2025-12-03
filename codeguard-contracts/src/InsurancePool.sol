// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title InsurancePool
 * @notice Stake-based insurance pool for protocol protection
 * @dev Users stake ETH to earn rewards and provide coverage for exploits
 */
contract InsurancePool is Ownable, ReentrancyGuard {
    struct Claim {
        uint256 id;
        address protocol;
        uint256 amount;
        string proof;
        uint256 timestamp;
        bool approved;
        bool paid;
        address claimant;
    }
    
    struct StakerInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 stakedAt;
    }
    
    mapping(address => StakerInfo) public stakers;
    mapping(address => uint256) public protocolCoverage;
    Claim[] public claims;
    
    uint256 public totalStaked;
    uint256 public totalClaimsPaid;
    uint256 public rewardRate = 500; // 5% APY in basis points
    
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event ClaimFiled(
        uint256 indexed claimId,
        address indexed protocol,
        uint256 amount,
        uint256 timestamp
    );
    event ClaimApproved(uint256 indexed claimId, uint256 timestamp);
    event ClaimPaid(
        uint256 indexed claimId,
        address indexed protocol,
        uint256 amount,
        uint256 timestamp
    );
    event CoverageUpdated(
        address indexed protocol,
        uint256 newCoverage,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    function stake() external payable nonReentrant {
        require(msg.value > 0, "Must stake non-zero amount");
        
        StakerInfo storage staker = stakers[msg.sender];
        
        if (staker.stakedAmount > 0) {
            uint256 pending = calculatePendingRewards(msg.sender);
            if (pending > 0) {
                payable(msg.sender).transfer(pending);
            }
        }
        
        staker.stakedAmount += msg.value;
        staker.stakedAt = block.timestamp;
        totalStaked += msg.value;
        
        emit Staked(msg.sender, msg.value, block.timestamp);
    }
    
    function unstake(uint256 _amount) external nonReentrant {
        StakerInfo storage staker = stakers[msg.sender];
        require(staker.stakedAmount >= _amount, "Insufficient staked amount");
        require(
            block.timestamp >= staker.stakedAt + 7 days,
            "7-day lock period active"
        );
        
        uint256 pending = calculatePendingRewards(msg.sender);
        
        staker.stakedAmount -= _amount;
        totalStaked -= _amount;
        
        uint256 totalPayout = _amount + pending;
        payable(msg.sender).transfer(totalPayout);
        
        emit Unstaked(msg.sender, _amount, block.timestamp);
    }
    
    function fileClaim(
        address _protocol,
        uint256 _amount,
        string memory _proof
    ) external returns (uint256) {
        require(_protocol != address(0), "Invalid protocol address");
        require(_amount > 0, "Claim amount must be positive");
        require(protocolCoverage[_protocol] >= _amount, "Insufficient coverage");
        
        uint256 claimId = claims.length;
        
        Claim memory newClaim = Claim({
            id: claimId,
            protocol: _protocol,
            amount: _amount,
            proof: _proof,
            timestamp: block.timestamp,
            approved: false,
            paid: false,
            claimant: msg.sender
        });
        
        claims.push(newClaim);
        
        emit ClaimFiled(claimId, _protocol, _amount, block.timestamp);
        
        return claimId;
    }
    
    function approveClaim(uint256 _claimId) external onlyOwner {
        require(_claimId < claims.length, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(!claim.approved, "Claim already approved");
        require(!claim.paid, "Claim already paid");
        
        claim.approved = true;
        
        emit ClaimApproved(_claimId, block.timestamp);
    }
    
    function payClaim(uint256 _claimId) external onlyOwner nonReentrant {
        require(_claimId < claims.length, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(claim.approved, "Claim not approved");
        require(!claim.paid, "Claim already paid");
        require(address(this).balance >= claim.amount, "Insufficient pool balance");
        
        claim.paid = true;
        totalClaimsPaid += claim.amount;
        
        payable(claim.claimant).transfer(claim.amount);
        
        emit ClaimPaid(_claimId, claim.protocol, claim.amount, block.timestamp);
    }
    
    function updateProtocolCoverage(
        address _protocol,
        uint256 _newCoverage
    ) external onlyOwner {
        require(_protocol != address(0), "Invalid protocol address");
        protocolCoverage[_protocol] = _newCoverage;
        
        emit CoverageUpdated(_protocol, _newCoverage, block.timestamp);
    }
    
    function calculatePendingRewards(address _staker) public view returns (uint256) {
        StakerInfo memory staker = stakers[_staker];
        if (staker.stakedAmount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - staker.stakedAt;
        uint256 reward = (staker.stakedAmount * rewardRate * timeStaked) / (365 days * 10000);
        
        return reward;
    }
    
    function getStakerInfo(address _staker) external view returns (StakerInfo memory) {
        return stakers[_staker];
    }
    
    function getClaim(uint256 _claimId) external view returns (Claim memory) {
        require(_claimId < claims.length, "Invalid claim ID");
        return claims[_claimId];
    }
    
    function getTotalClaims() external view returns (uint256) {
        return claims.length;
    }
    
    function getPoolStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalClaimsPaid,
        uint256 _balance,
        uint256 _rewardRate
    ) {
        return (totalStaked, totalClaimsPaid, address(this).balance, rewardRate);
    }
    
    receive() external payable {}
}
