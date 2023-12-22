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

    struct Product {
        uint256 tokenId;
        uint256 price;
        string uri;
        address sender;
    }

    Product[] products;
    mapping(uint256 => Product) public tokenIdToProduct;

    constructor(address _moneyUse) MyNFTToken(msg.sender) {
        erc20Address = _moneyUse;
    }

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

    // Function to set the marketplace fee (in basis points)
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 10000, "Fee must be in basis points (0-10000)");
        marketplaceFee = newFee;
    }

    //Marketplace
    // Struct to represent an NFT
    struct NFT {
        address seller;
        uint256 tokenId;
        uint256 price;
        bool isListed;
    }

    // Mapping from token ID to NFT information
    mapping(uint256 => NFT) public nfts;

    // Marketplace fee percentage (in basis points)
    uint256 public marketplaceFee = 100; // 1%

    // Event emitted when an NFT is listed
    event NFTListed(
        uint256 tokenId,
        address nftAddress,
        uint256 price,
        address owner
    );

    // Event emitted when an NFT is purchased
    event NFTPurchased(
        uint256 tokenId,
        uint256 price,
        address buyer,
        address seller
    );

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

    // Modifier to ensure that an NFT is listed
    modifier onlyListed(uint256 tokenId) {
        require(nfts[tokenId].isListed, "NFT not listed");
        _;
    }

    // Function to list an NFT on the marketplace
    function listNftFromSeller(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external isOwner(nftAddress, tokenId, msg.sender){
        require(!nfts[tokenId].isListed, "NFT already listed");
        require(price > 0, "Price must be greater than zero");
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        NFT memory newNft;
        newNft.seller = msg.sender;
        newNft.price = price;
        newNft.tokenId = tokenId;
        newNft.isListed = true;
        nfts[tokenId] = newNft;

        // nftListingOwners[tokenId] = msg.sender;
        emit NFTListed(tokenId, nftAddress, price, msg.sender);
    }

    // Function to purchase an NFT from the marketplace
    // function purchaseNftFromSeller(
    //     uint256 tokenId
    // ) external payable onlyListed(tokenId) {
    //     NFT nft = nfts[tokenId];
    //     uint256 price = nft.price;
    //     address seller = nft.owner;

    //     require(msg.value == price, "Incorrect payment amount");
    //     require(msg.sender != seller, "Cannot buy your own NFT");

    //     // Calculate the marketplace fee
    //     uint256 feeAmount = price.mul(marketplaceFee).div(10000);

    //     // Transfer the payment to the seller (minus the marketplace fee)
    //     payable(seller).transfer(price.sub(feeAmount));

    //     // Transfer the marketplace fee to the contract owner or another specified address
    //     // Replace 'owner()' with the actual address where you want to receive the fee
    //     payable(owner()).transfer(feeAmount);

    //     // Transfer the ownership of the NFT to the buyer
    //     nft.owner = msg.sender;
    //     nft.isListed = false;
    //     // nftListingOwners[tokenId] = address(0);

    //     emit NFTPurchased(tokenId, price, msg.sender, seller);
    // }

    // function getAllListedNFTFromSeller() public view returns (NFT[] memory) {
    //     NFT[] listedNfts;
    //     // Counter to keep track of the index in the dynamic array
    //     uint256 index = 0;

    //     // Iterate through all NFTs to find the listed ones
    //     for (uint256 tokenId = 1; tokenId <= nftCount(); tokenId++) {
    //         if (nfts[tokenId].isListed) {
    //             listedNfts[index] = tokenId;
    //             index++;
    //         }
    //     }

    //     for (uint256 i = 0; i < nfts.length; i++) {
    //         NFT nft = nfts[i];
    //         if (nft.isListed) {
    //             listedNfts[index] = nft;
    //         }
    //         index++;
    //     }

    //     return listedNfts;
    // }
}
