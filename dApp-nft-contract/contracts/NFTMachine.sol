// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyNFTToken.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract NFTMachine is MyNFTToken {
    address public erc20Address;
    // struct NFT
    // mapping tokenId to owner's address
    // mapping owner's address to a list of tokenId
    // function mint new NFT
    // function get owner's all NFT
    // function get NFT metadata
    // function transfer NFT
    // struct order
    // function create order
    // function cancel order 
    // function buy

    struct Product {
        uint256 tokenId;
        uint256 price;
        string uri;
        address sender;
    }

    Order[] orders;
    // From ERC721 registry assetId to Order (to avoid asset collision)
    mapping(IERC721 => mapping(uint256 => Order)) public orderByAssetId;

    Product[] products;
    mapping(uint256 => Product) public tokenIdToProduct;

    constructor(address _moneyUse) MyNFTToken(msg.sender) {
        erc20Address = _moneyUse;
    }

    //Marketplace
    // Struct to represent an NFT
    NFT[] myNfts;

    struct NFT {
        address owner;
        uint256 tokenId;
        string name;
        string img;
        string user;
        Attribute[] attributes;
    }

    struct Attribute {
        string key;
        string value;
    }

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

    // Marketplace fee percentage (in basis points)
    uint256 public marketplaceFee = 100; // 1%

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

    event OrderFiatSuccessful(
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 price,
        address nftAddress
    );

    event OrderCancelled(
        bytes32 id,
        uint256 indexed tokenId,
        address indexed seller,
        address nftAddress
    );

    function mintNewNFT(string memory uri, uint256 price) public {
        require(msg.sender == owner(), "You are not owner");
        uint256 tokenId = safeMint(owner(), uri);
        Product memory newProduct;
        newProduct.tokenId = tokenId;
        newProduct.price = price;
        newProduct.uri = uri;
        newProduct.sender = msg.sender;
        tokenIdToProduct[tokenId] = newProduct;
        products.push(newProduct);
    }

    function sellerMintNewNFT(string memory uri) public {
        uint256 tokenId = safeMint(owner(), uri);
        Product memory newProduct;
        newProduct.tokenId = tokenId;
        // newProduct.price = price;
        newProduct.uri = uri;
        newProduct.sender = msg.sender;
        tokenIdToProduct[tokenId] = newProduct;
        products.push(newProduct);
    }

    function buyNFTfromOwner(uint256 _tokenId) public {
        require(
            IERC20(erc20Address).allowance(msg.sender, address(this)) >=
                tokenIdToProduct[_tokenId].price,
            "insufficient approval"
        );
        IERC20(erc20Address).transferFrom(
            msg.sender,
            address(this),
            tokenIdToProduct[_tokenId].price
        );
        this.transferFrom(owner(), msg.sender, _tokenId);
    }

    function getAllNFT() public view returns (Product[] memory) {
        return products;
    }

    function getMyNFT() public view returns (Product[] memory) {
        return products;
    }

    // Function to set the marketplace fee (in basis points)
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 10000, "Fee must be in basis points (0-10000)");
        marketplaceFee = newFee;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    function createMarketItemSale(
        IERC721 nftContract,
        uint256 tokenId,
        uint256 priceInWei
    ) public {
        (bytes32 orderId, address nftOwner) = _createMarketItemSale(
            nftContract,
            tokenId,
            priceInWei
        );
        //add orders
        Order memory order = orderByAssetId[nftContract][tokenId];
        orders.push(order);
        emit OrderCreated(
            orderId,
            tokenId,
            nftOwner,
            address(nftContract),
            priceInWei
        );
    }

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

    function getAllOrders() public view returns (Order[] memory) {
        return orders;
    }
}
