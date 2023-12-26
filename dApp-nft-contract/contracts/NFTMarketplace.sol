// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IERC721NFT {
    function getInfoCollection(uint256 _id)
        external
        view
        returns (uint256[] memory);
}

contract NFTMarketplace is Ownable, ReentrancyGuard, AccessControl, Pausable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _offerIds;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGERMENT_ROLE = keccak256("MANAGERMENT_ROLE");

    // fee seller
    uint256 public feeSeller;
    address public addressReceiveFee;
    uint8 decimalsFee = 18;

    struct Order {
        // Order ID
        bytes32 id;
        // Owner of the NFT
        address seller;
        // NFT registry address
        IERC721 nft;
        // Price (in wei) for the published item
        uint256 price;
    }

    // stored offer information of an item
    struct Offer {
        uint256 offerId;
        address asker;
        uint256 amount;
    }

    // From ERC721 registry assetId to Order (to avoid asset collision)
    mapping(IERC721 => mapping(uint256 => Order)) public orderByAssetId;

    // tokenIdToOffer[nftContract][tokenId][offerId] to get offer
    mapping(IERC721 => mapping(uint256 => mapping(uint256 => Offer)))
        public tokenIdToOffer;

    mapping(IERC721 => mapping(uint256 => EnumerableSet.UintSet))
        private tokenIdToOffers;

    mapping(IERC721 => mapping(uint256 => mapping(address => EnumerableSet.UintSet)))
        private offerIdOfOwner;

    // EVENTS
    event OrderCreated(
        bytes32 id,
        uint256 indexed tokenId,
        address indexed seller,
        address nftAddress,
        uint256 priceInWei
    );
    event OrderCreatedCollection(
        bytes32[] listOrderId,
        uint256[] listTokenId,
        address indexed seller,
        address nftAddress,
        uint256 priceInWei
    );
    event OrderSuccessful(
        bytes32 id,
        uint256 indexed tokenId,
        address indexed seller,
        address nftAddress,
        uint256 price,
        address indexed buyer
    );
    
    event OrderCancelled(
        bytes32 id,
        uint256 indexed tokenId,
        address indexed seller,
        address nftAddress
    );

    event ChangedFeeSeller(uint256 newFee);
    event ChangedAddressReceiveSeller(address addressReceiveFee);

    /**
     * @dev Initialize this contract. Acts as a constructor
     * @param _feeSeller - fee seller
     * @param _addressReceiceFee - fee recipient address
     */
    constructor(uint256 _feeSeller, address _addressReceiceFee) {
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(MANAGERMENT_ROLE, MANAGERMENT_ROLE);
        _setupRole(ADMIN_ROLE, _msgSender());
        _setupRole(MANAGERMENT_ROLE, _msgSender());
        // Fee init
        setFeeSeller(_feeSeller);
        setNewAddressFee(_addressReceiceFee);
    }

    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Set new decimals fee
     * @param _decimalsFee - new decimals fee seller
     */
    function setDecimalsFee(uint8 _decimalsFee)
        public
        onlyRole(MANAGERMENT_ROLE)
    {
        decimalsFee = _decimalsFee;
    }

    /**
     * @dev Set new fee seller
     * @param _feeSeller - new fee seller
     */
    function setFeeSeller(uint256 _feeSeller)
        public
        onlyRole(MANAGERMENT_ROLE)
    {
        feeSeller = _feeSeller;
        emit ChangedFeeSeller(feeSeller);
    }

    /**
     * @dev Set new address fee seller
     * @param _newAddressFee: new address fee seller
     */
    function setNewAddressFee(address _newAddressFee)
        public
        onlyRole(MANAGERMENT_ROLE)
    {
        addressReceiveFee = _newAddressFee;
        emit ChangedAddressReceiveSeller(addressReceiveFee);
    }

    /**
     * @dev Creates a new market item.
     * @param nftContract: address of nft contract
     * @param tokenId: id of token in nft contract
     * @param priceInWei: price in tokenBase
     */
    function createMarketItemSale(
        IERC721 nftContract,
        uint256 tokenId,
        uint256 priceInWei
    ) public nonReentrant whenNotPaused {
        (bytes32 orderId, address nftOwner) = _createMarketItemSale(
            nftContract,
            tokenId,
            priceInWei
        );
        emit OrderCreated(
            orderId,
            tokenId,
            nftOwner,
            address(nftContract),
            priceInWei
        );
    }

    /**
     * @dev Creates a new market item.
     * @param nftContract: address of nft contract
     * @param tokenId: id of token in nft contract
     * @param priceInWei: price in tokenBase
     */
    function _createMarketItemSale(
        IERC721 nftContract,
        uint256 tokenId,
        uint256 priceInWei
    ) internal returns (bytes32, address) {
        address nftOwner = nftContract.ownerOf(tokenId);
        require(nftOwner == msg.sender, "Only the owner can create orders");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
                nftContract.isApprovedForAll(nftOwner, address(this)),
            "The contract is not authorized to manage the asset"
        );
        require(priceInWei > 0, "Price should be bigger than 0");

        bytes32 orderId = keccak256(
            abi.encodePacked(
                block.timestamp,
                nftOwner,
                tokenId,
                address(nftContract),
                priceInWei
            )
        );

        orderByAssetId[nftContract][tokenId] = Order({
            id: orderId,
            seller: nftOwner,
            nft: nftContract,
            price: priceInWei
        });

        return (orderId, nftOwner);
    }
}
