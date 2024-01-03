// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyNFTToken.sol";

// error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
// error ItemNotForSale(address nftAddress, uint256 tokenId);
// error NotListed(address nftAddress, uint256 tokenId);
// error AlreadyListed(address nftAddress, uint256 tokenId);
// error NoProceeds();
// error NotOwner();
// error NotApprovedForMarketplace();
// error PriceMustBeAboveZero();

contract NFTMachine is MyNFTToken(msg.sender) {
    address public erc20Address;
    // struct NFT
    // struct NFTAttribute {
    //     string key;
    //     string value;
    // }

    struct NFT {
        uint256 tokenId; // maybe removed
        string attribute_url;
        // string img_uri;
        // NFTAttribute[] attributes;
        // address owner; // maybe removed
    }

    NFT[] AllNFTs;

    // function get all NFTs
    function getAllNFT() public view returns (NFT[] memory) {
        return AllNFTs;
    }

    // mapping tokenId to NFT data
    mapping(uint256 => NFT) public tokenIdToNFT;

    // mapping tokenId to owner's address
    // mapping(uint256 => address) public tokenIdOwner;
    // user ownerOf()

    // mapping owner's address to a list of tokenId
    mapping (address => uint256[]) public userNFTCollection;

    // function mint new NFT
    function mintNewNFT(string memory attribute_url) public returns(uint256) {
        require(msg.sender == owner(), "You are not owner.");
        uint256 tokenId = safeMint(owner(), attribute_url);
        // Save NFT
        NFT memory newNFT;
        newNFT.tokenId = tokenId;
        newNFT.attribute_url = attribute_url;
        // newNFT.img_uri = img_uri;
        tokenIdToNFT[tokenId] = newNFT;
        AllNFTs.push(newNFT);

        // Set owner
        // tokenIdOwner[tokenId] = owner();
        userNFTCollection[owner()].push(tokenId);

        return tokenId;
    }

    // function get owner's all NFT
    function getOwnerNFT(address owner_address) public view returns (NFT[] memory) {
        NFT[] memory owner_NFT = new NFT[](userNFTCollection[owner_address].length);
        
        for (uint i=0; i < userNFTCollection[owner_address].length; i++) {
            owner_NFT[i] = tokenIdToNFT[userNFTCollection[owner_address][i]];
        }
        return owner_NFT;
    }

    // function transfer NFT
    // struct order
    uint256 public _orderId = 1;

    struct Order {
        uint256 orderId;
        uint256 tokenId;
        address seller;
        uint256 priceInWei;
    }

    Order[] AllOrders;
    
    // mapping orderId to Order data
    mapping(uint256 => Order) public orderIdtoOrder;

    // A NFT is listing or not
    mapping(uint256 => bool) public listing;

    // function get all Orders
    function getAllOrders() public view returns (Order[] memory) {
        return AllOrders;
    }

    // before creating order, user must call approve() to approve NFT to smartcontract address 
    // function create order
    function createOrder(IERC721 nftContract, uint256 tokenId, uint256 priceInWei) public returns(uint256) {
        address nftOwner = nftContract.ownerOf(tokenId);
        require(
            nftContract.getApproved(tokenId) == address(this) ||
                nftContract.isApprovedForAll(nftOwner, address(this)),
            "The contract is not authorized to manage the NFT."
        );
        require(ownerOf(tokenId) == msg.sender, "Only the NFT owner can create an order.");
        require(priceInWei > 0, "Price must be greater than zero.");
        require(listing[tokenId] == false, "NFT is listing.");

        // Save order
        Order memory newOrder;
        uint256 orderId = _orderId++;
        newOrder.orderId = orderId;
        newOrder.tokenId = tokenId;
        newOrder.seller = msg.sender;
        newOrder.priceInWei = priceInWei;

        AllOrders.push(newOrder);

        orderIdtoOrder[orderId] = newOrder;

        // Mark NFT as listing
        listing[tokenId] = true;

        return orderId;
    }

    // function cancel order 
    function cancelOrder(uint256 orderId) public returns(bool) {
        require(orderIdtoOrder[orderId].seller == msg.sender, "You are not the seller.");

        // Mark NFT as not listing
        listing[orderIdtoOrder[orderId].tokenId] = false;

        // Revoke approval by approve to zero address
        approve(address(0), orderIdtoOrder[orderId].tokenId);

        // Remove order
        for (uint i = 0; i < AllOrders.length - 1; i++) {
            if (AllOrders[i].tokenId == orderIdtoOrder[orderId].tokenId) {
                AllOrders[i] = AllOrders[AllOrders.length - 1];  
            }            
        }
        AllOrders.pop();

        return true;
    }

    // function buy
    function buyNFT(uint256 orderId) public payable returns (bool) {
        Order memory order = orderIdtoOrder[orderId];
        address seller = order.seller;

        require(seller != address(0), "Invalid order.");
        require(seller != msg.sender, "You cannot buy your NFT.");
        require(order.priceInWei == msg.value, "The price is not correct.");
        require(seller == this.ownerOf(order.tokenId),"This was an old order. The seller is no longer the owner.");

        // Transfer sale amount to seller
        require(payable(seller).send(order.priceInWei), "Transfering the sale amount to the seller failed");

        // Transfer asset owner
        this.safeTransferFrom(seller, msg.sender, order.tokenId);

        // Set owner
        // tokenIdOwner[order.tokenId] = owner();
        userNFTCollection[msg.sender].push(order.tokenId);

        // Remove NFT from seller list
        for (uint i = 0; i < userNFTCollection[seller].length - 1; i++) {
            if (userNFTCollection[seller][i] == order.tokenId) {
                userNFTCollection[seller][i] = userNFTCollection[seller][userNFTCollection[seller].length - 1];  
            }               
        }
        userNFTCollection[seller].pop();

        // Remove order
        for (uint i = 0; i < AllOrders.length - 1; i++) {
            if (AllOrders[i].tokenId == orderIdtoOrder[orderId].tokenId) {
                AllOrders[i] = AllOrders[AllOrders.length - 1];  
            }            
        }
        AllOrders.pop();

        // Mark NFT as not listing
        listing[orderIdtoOrder[orderId].tokenId] = false;

        return true;
    }


    // struct Product {
    //     uint256 tokenId;
    //     uint256 price;
    //     string uri;
    //     address sender;
    // }

    // Order[] orders;
    // // From ERC721 registry assetId to Order (to avoid asset collision)
    // mapping(IERC721 => mapping(uint256 => Order)) public orderByAssetId;

    // Product[] products;
    // mapping(uint256 => Product) public tokenIdToProduct;

    // constructor(address _moneyUse) MyNFTToken(msg.sender) {
    //     erc20Address = _moneyUse;
    // }

    // //Marketplace
    // // Struct to represent an NFT
    // NFT[] myNfts;

    // struct NFT {
    //     address owner;
    //     uint256 tokenId;
    //     string name;
    //     string img;
    //     string user;
    //     Attribute[] attributes;
    // }

    // struct Attribute {
    //     string key;
    //     string value;
    // }

    // struct Order {
    //     // Order ID
    //     bytes32 id;
    //     // Owner of the NFT
    //     address seller;
    //     // NFT registry address
    //     IERC721 nft;
    //     // Price (in wei) for the published item
    //     uint256 price;
    // }

    // // Marketplace fee percentage (in basis points)
    // uint256 public marketplaceFee = 100; // 1%

    // // EVENTS
    // event OrderCreated(
    //     bytes32 id,
    //     uint256 indexed tokenId,
    //     address indexed seller,
    //     address nftAddress,
    //     uint256 priceInWei
    // );
    // event OrderCreatedCollection(
    //     bytes32[] listOrderId,
    //     uint256[] listTokenId,
    //     address indexed seller,
    //     address nftAddress,
    //     uint256 priceInWei
    // );
    // event OrderSuccessful(
    //     bytes32 id,
    //     uint256 indexed tokenId,
    //     address indexed seller,
    //     address nftAddress,
    //     uint256 price,
    //     address indexed buyer
    // );

    // event OrderFiatSuccessful(
    //     address indexed seller,
    //     address indexed buyer,
    //     uint256 tokenId,
    //     uint256 price,
    //     address nftAddress
    // );

    // event OrderCancelled(
    //     bytes32 id,
    //     uint256 indexed tokenId,
    //     address indexed seller,
    //     address nftAddress
    // );

    // function mintNewNFT(string memory uri, uint256 price) public {
    //     require(msg.sender == owner(), "You are not owner");
    //     uint256 tokenId = safeMint(owner(), uri);
    //     Product memory newProduct;
    //     newProduct.tokenId = tokenId;
    //     newProduct.price = price;
    //     newProduct.uri = uri;
    //     newProduct.sender = msg.sender;
    //     tokenIdToProduct[tokenId] = newProduct;
    //     products.push(newProduct);
    // }

    // function sellerMintNewNFT(string memory uri) public {
    //     uint256 tokenId = safeMint(owner(), uri);
    //     Product memory newProduct;
    //     newProduct.tokenId = tokenId;
    //     // newProduct.price = price;
    //     newProduct.uri = uri;
    //     newProduct.sender = msg.sender;
    //     tokenIdToProduct[tokenId] = newProduct;
    //     products.push(newProduct);
    // }

    // function buyNFTfromOwner(uint256 _tokenId) public {
    //     require(
    //         IERC20(erc20Address).allowance(msg.sender, address(this)) >=
    //             tokenIdToProduct[_tokenId].price,
    //         "insufficient approval"
    //     );
    //     IERC20(erc20Address).transferFrom(
    //         msg.sender,
    //         address(this),
    //         tokenIdToProduct[_tokenId].price
    //     );
    //     this.transferFrom(owner(), msg.sender, _tokenId);
    // }

    // function getAllNFT() public view returns (Product[] memory) {
    //     return products;
    // }

    // function getMyNFT() public view returns (Product[] memory) {
    //     return products;
    // }

    // // Function to set the marketplace fee (in basis points)
    // function setMarketplaceFee(uint256 newFee) external onlyOwner {
    //     require(newFee <= 10000, "Fee must be in basis points (0-10000)");
    //     marketplaceFee = newFee;
    // }

    // modifier isOwner(
    //     address nftAddress,
    //     uint256 tokenId,
    //     address spender
    // ) {
    //     IERC721 nft = IERC721(nftAddress);
    //     address owner = nft.ownerOf(tokenId);
    //     if (spender != owner) {
    //         revert NotOwner();
    //     }
    //     _;
    // }

    // function createMarketItemSale(
    //     IERC721 nftContract,
    //     uint256 tokenId,
    //     uint256 priceInWei
    // ) public {
    //     (bytes32 orderId, address nftOwner) = _createMarketItemSale(
    //         nftContract,
    //         tokenId,
    //         priceInWei
    //     );
    //     //add orders
    //     Order memory order = orderByAssetId[nftContract][tokenId];
    //     orders.push(order);
    //     emit OrderCreated(
    //         orderId,
    //         tokenId,
    //         nftOwner,
    //         address(nftContract),
    //         priceInWei
    //     );
    // }

    // function _createMarketItemSale(
    //     IERC721 nftContract,
    //     uint256 tokenId,
    //     uint256 priceInWei
    // ) internal returns (bytes32, address) {
    //     address nftOwner = nftContract.ownerOf(tokenId);
    //     require(nftOwner == msg.sender, "Only the owner can create orders");
    //     require(
    //         nftContract.getApproved(tokenId) == address(this) ||
    //             nftContract.isApprovedForAll(nftOwner, address(this)),
    //         "The contract is not authorized to manage the asset"
    //     );
    //     require(priceInWei > 0, "Price should be bigger than 0");

    //     bytes32 orderId = keccak256(
    //         abi.encodePacked(
    //             block.timestamp,
    //             nftOwner,
    //             tokenId,
    //             address(nftContract),
    //             priceInWei
    //         )
    //     );
    //     orderByAssetId[nftContract][tokenId] = Order({
    //         id: orderId,
    //         seller: nftOwner,
    //         nft: nftContract,
    //         price: priceInWei
    //     });

    //     return (orderId, nftOwner);
    // }

    // function getAllOrders() public view returns (Order[] memory) {
    //     return orders;
    // }
// }
}