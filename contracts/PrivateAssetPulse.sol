// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PrivateAssetPulse is SepoliaConfig {
    using FHE for *;
    
    struct Asset {
        euint32 assetId;
        euint32 totalValue;
        euint32 availableTokens;
        euint32 minInvestment;
        euint32 yield;
        ebool isEncrypted;
        AssetType assetType;
        string name;
        string location;
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct Investment {
        euint32 investmentId;
        euint32 assetId;
        euint32 amount;
        euint32 tokens;
        address investor;
        uint256 timestamp;
        InvestmentStatus status;
    }
    
    struct TradingOrder {
        euint32 orderId;
        euint32 assetId;
        euint32 tokenAmount;
        euint32 pricePerToken;
        OrderType orderType;
        address trader;
        uint256 timestamp;
        OrderStatus status;
    }
    
    enum AssetType {
        REAL_ESTATE,
        COMMODITY,
        ART,
        PRECIOUS_METALS,
        INFRASTRUCTURE
    }
    
    enum InvestmentStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        SETTLED
    }
    
    enum OrderType {
        BUY,
        SELL
    }
    
    enum OrderStatus {
        OPEN,
        FILLED,
        CANCELLED,
        EXPIRED
    }
    
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => Investment) public investments;
    mapping(uint256 => TradingOrder) public orders;
    mapping(address => euint32) public investorReputation;
    mapping(address => euint32) public assetOwnerReputation;
    mapping(address => euint32) public tradingVolume;
    
    uint256 public assetCounter;
    uint256 public investmentCounter;
    uint256 public orderCounter;
    
    address public owner;
    address public verifier;
    address public liquidityProvider;
    
    uint256 public constant MIN_INVESTMENT_AMOUNT = 1000; // $1000 minimum
    uint256 public constant TRADING_FEE_PERCENTAGE = 25; // 0.25%
    uint256 public constant SETTLEMENT_PERIOD = 7 days;
    
    event AssetCreated(uint256 indexed assetId, address indexed owner, string name, AssetType assetType);
    event InvestmentMade(uint256 indexed investmentId, uint256 indexed assetId, address indexed investor, uint32 amount);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed assetId, address indexed trader, OrderType orderType);
    event OrderFilled(uint256 indexed orderId, uint256 indexed assetId, address indexed buyer, address indexed seller);
    event AssetVerified(uint256 indexed assetId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event SettlementCompleted(uint256 indexed investmentId, uint256 indexed assetId);
    
    constructor(address _verifier, address _liquidityProvider) {
        owner = msg.sender;
        verifier = _verifier;
        liquidityProvider = _liquidityProvider;
    }
    
    function createAsset(
        string memory _name,
        string memory _location,
        AssetType _assetType,
        externalEuint32 _totalValue,
        externalEuint32 _availableTokens,
        externalEuint32 _minInvestment,
        externalEuint32 _yield,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Asset name cannot be empty");
        require(bytes(_location).length > 0, "Asset location cannot be empty");
        
        uint256 assetId = assetCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalTotalValue = FHE.fromExternal(_totalValue, inputProof);
        euint32 internalAvailableTokens = FHE.fromExternal(_availableTokens, inputProof);
        euint32 internalMinInvestment = FHE.fromExternal(_minInvestment, inputProof);
        euint32 internalYield = FHE.fromExternal(_yield, inputProof);
        
        assets[assetId] = Asset({
            assetId: FHE.asEuint32(0), // Will be set properly later
            totalValue: internalTotalValue,
            availableTokens: internalAvailableTokens,
            minInvestment: internalMinInvestment,
            yield: internalYield,
            isEncrypted: FHE.asEbool(true),
            assetType: _assetType,
            name: _name,
            location: _location,
            owner: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit AssetCreated(assetId, msg.sender, _name, _assetType);
        return assetId;
    }
    
    function makeInvestment(
        uint256 assetId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        require(msg.value >= MIN_INVESTMENT_AMOUNT, "Investment below minimum amount");
        
        uint256 investmentId = investmentCounter++;
        
        // Convert external encrypted amount to internal encrypted amount
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        // Calculate tokens based on encrypted values (simplified calculation)
        // In a real implementation, this would involve FHE operations
        euint32 tokens = FHE.div(internalAmount, FHE.asEuint32(1000)); // Simplified: 1 token = $1000
        
        investments[investmentId] = Investment({
            investmentId: FHE.asEuint32(0), // Will be set properly later
            assetId: FHE.asEuint32(assetId),
            amount: internalAmount,
            tokens: tokens,
            investor: msg.sender,
            timestamp: block.timestamp,
            status: InvestmentStatus.PENDING
        });
        
        // Update asset available tokens
        assets[assetId].availableTokens = FHE.sub(assets[assetId].availableTokens, tokens);
        assets[assetId].updatedAt = block.timestamp;
        
        emit InvestmentMade(investmentId, assetId, msg.sender, 0); // Amount will be decrypted off-chain
        return investmentId;
    }
    
    function placeOrder(
        uint256 assetId,
        externalEuint32 tokenAmount,
        externalEuint32 pricePerToken,
        OrderType orderType,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        require(orderType == OrderType.BUY || orderType == OrderType.SELL, "Invalid order type");
        
        uint256 orderId = orderCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalTokenAmount = FHE.fromExternal(tokenAmount, inputProof);
        euint32 internalPricePerToken = FHE.fromExternal(pricePerToken, inputProof);
        
        orders[orderId] = TradingOrder({
            orderId: FHE.asEuint32(0), // Will be set properly later
            assetId: FHE.asEuint32(assetId),
            tokenAmount: internalTokenAmount,
            pricePerToken: internalPricePerToken,
            orderType: orderType,
            trader: msg.sender,
            timestamp: block.timestamp,
            status: OrderStatus.OPEN
        });
        
        emit OrderPlaced(orderId, assetId, msg.sender, orderType);
        return orderId;
    }
    
    function fillOrder(uint256 orderId, uint256 matchingOrderId) public {
        require(orders[orderId].trader != address(0), "Order does not exist");
        require(orders[matchingOrderId].trader != address(0), "Matching order does not exist");
        require(orders[orderId].status == OrderStatus.OPEN, "Order is not open");
        require(orders[matchingOrderId].status == OrderStatus.OPEN, "Matching order is not open");
        
        TradingOrder storage order = orders[orderId];
        TradingOrder storage matchingOrder = orders[matchingOrderId];
        
        // Verify orders are for the same asset and opposite types
        require(FHE.decrypt(order.assetId) == FHE.decrypt(matchingOrder.assetId), "Orders must be for same asset");
        require(order.orderType != matchingOrder.orderType, "Orders must be opposite types");
        
        // Update order statuses
        order.status = OrderStatus.FILLED;
        matchingOrder.status = OrderStatus.FILLED;
        
        // Calculate trading fee (simplified)
        euint32 tradingFee = FHE.div(FHE.mul(order.tokenAmount, order.pricePerToken), FHE.asEuint32(10000)); // 0.25%
        
        // Update trading volumes
        tradingVolume[order.trader] = FHE.add(tradingVolume[order.trader], order.tokenAmount);
        tradingVolume[matchingOrder.trader] = FHE.add(tradingVolume[matchingOrder.trader], matchingOrder.tokenAmount);
        
        emit OrderFilled(orderId, FHE.decrypt(order.assetId), order.trader, matchingOrder.trader);
    }
    
    function verifyAsset(uint256 assetId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify assets");
        require(assets[assetId].owner != address(0), "Asset does not exist");
        
        // In a real implementation, this would update an encrypted verification status
        emit AssetVerified(assetId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation, bool isInvestor) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        if (isInvestor) {
            investorReputation[user] = reputation;
        } else {
            assetOwnerReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function settleInvestment(uint256 investmentId) public {
        require(investments[investmentId].investor != address(0), "Investment does not exist");
        require(investments[investmentId].status == InvestmentStatus.CONFIRMED, "Investment must be confirmed");
        require(block.timestamp >= investments[investmentId].timestamp + SETTLEMENT_PERIOD, "Settlement period not reached");
        
        investments[investmentId].status = InvestmentStatus.SETTLED;
        
        uint256 assetId = FHE.decrypt(investments[investmentId].assetId);
        emit SettlementCompleted(investmentId, assetId);
    }
    
    function getAssetInfo(uint256 assetId) public view returns (
        string memory name,
        string memory location,
        AssetType assetType,
        uint8 totalValue,
        uint8 availableTokens,
        uint8 minInvestment,
        uint8 yield,
        bool isEncrypted,
        address owner,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Asset storage asset = assets[assetId];
        return (
            asset.name,
            asset.location,
            asset.assetType,
            0, // FHE.decrypt(asset.totalValue) - will be decrypted off-chain
            0, // FHE.decrypt(asset.availableTokens) - will be decrypted off-chain
            0, // FHE.decrypt(asset.minInvestment) - will be decrypted off-chain
            0, // FHE.decrypt(asset.yield) - will be decrypted off-chain
            FHE.decrypt(asset.isEncrypted),
            asset.owner,
            asset.createdAt,
            asset.updatedAt
        );
    }
    
    function getInvestmentInfo(uint256 investmentId) public view returns (
        uint8 assetId,
        uint8 amount,
        uint8 tokens,
        address investor,
        uint256 timestamp,
        InvestmentStatus status
    ) {
        Investment storage investment = investments[investmentId];
        return (
            FHE.decrypt(investment.assetId),
            0, // FHE.decrypt(investment.amount) - will be decrypted off-chain
            0, // FHE.decrypt(investment.tokens) - will be decrypted off-chain
            investment.investor,
            investment.timestamp,
            investment.status
        );
    }
    
    function getOrderInfo(uint256 orderId) public view returns (
        uint8 assetId,
        uint8 tokenAmount,
        uint8 pricePerToken,
        OrderType orderType,
        address trader,
        uint256 timestamp,
        OrderStatus status
    ) {
        TradingOrder storage order = orders[orderId];
        return (
            FHE.decrypt(order.assetId),
            0, // FHE.decrypt(order.tokenAmount) - will be decrypted off-chain
            0, // FHE.decrypt(order.pricePerToken) - will be decrypted off-chain
            order.orderType,
            order.trader,
            order.timestamp,
            order.status
        );
    }
    
    function getInvestorReputation(address investor) public view returns (uint8) {
        return 0; // FHE.decrypt(investorReputation[investor]) - will be decrypted off-chain
    }
    
    function getAssetOwnerReputation(address owner) public view returns (uint8) {
        return 0; // FHE.decrypt(assetOwnerReputation[owner]) - will be decrypted off-chain
    }
    
    function getTradingVolume(address trader) public view returns (uint8) {
        return 0; // FHE.decrypt(tradingVolume[trader]) - will be decrypted off-chain
    }
    
    function withdrawFunds(uint256 investmentId) public {
        require(investments[investmentId].investor == msg.sender, "Only investor can withdraw");
        require(investments[investmentId].status == InvestmentStatus.SETTLED, "Investment must be settled");
        
        // In a real implementation, this would transfer the actual funds
        // For now, we'll just mark the investment as withdrawn
        investments[investmentId].status = InvestmentStatus.SETTLED;
    }
    
    function emergencyPause() public {
        require(msg.sender == owner, "Only owner can pause");
        // In a real implementation, this would pause all contract functions
    }
    
    function emergencyUnpause() public {
        require(msg.sender == owner, "Only owner can unpause");
        // In a real implementation, this would unpause all contract functions
    }
}
