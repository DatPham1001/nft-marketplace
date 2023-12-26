const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const typechain = require("../src/types");
const { erc20 } = require("../src/types/@openzeppelin/contracts/token");

describe("Machine", function () {
  async function prepare() {

    // prepare accounts
    const accounts = await ethers.getSigners();
    const [minter, buyer] = accounts;

    // deploy erc20 and machine
    const erc20 = await new typechain.NFTToken__factory(minter).deploy(minter.address);
    const machine = await new typechain.NFTMachine__factory(minter).deploy(erc20.target);
    // mint token for buyer
    await erc20.connect(minter).mint(buyer.address, 10);

    // set approve for machine
    await machine.connect(minter).setApprovalForAll(machine.target, true);

    return { minter, buyer, erc20, machine };
  }

  it("deployment", async function () {
    const { minter, buyer, erc20, machine } = await loadFixture(prepare);

    expect(await erc20.name.staticCall()).to.equal("NFTToken");
    expect(await machine.name.staticCall()).to.equal("MyNFTToken");
  });

  it("should mint new nft", async function () {
    const { minter, buyer, erc20, machine } = await loadFixture(prepare);

    expect(await machine.connect(minter).mintNewNFT("nft1.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft2.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft3.com", 1)).to.emit(machine, "Transfer");
  });

  it("should get all nft minted", async function () {
    const { minter, buyer, erc20, machine } = await loadFixture(prepare);

    expect(await machine.connect(minter).mintNewNFT("nft1.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft2.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft3.com", 1)).to.emit(machine, "Transfer");

    const allNFTs = await machine.getAllNFT.staticCall();
    expect(allNFTs.length).to.equal(3);
  });

  it("should sell nft successfully", async function () {
    const { minter, buyer, erc20, machine } = await loadFixture(prepare);

    expect(await machine.connect(minter).mintNewNFT("nft1.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft2.com", 1)).to.emit(machine, "Transfer");
    expect(await machine.connect(minter).mintNewNFT("nft3.com", 1)).to.emit(machine, "Transfer");

    await erc20.connect(buyer).approve(machine.target, 1);
    expect(await machine.connect(buyer).buyNFTfromOwner(0)).to.emit(machine, "Transfer");
    expect(await machine.ownerOf.staticCall(0)).to.equal(buyer.address);
  });

  // it("should list an NFT on the marketplace", async function () {
  //   const { minter, buyer, erc20, machine } = await loadFixture(prepare);
  //   const tokenId = 2;
  //   const price = 2;
  //   expect(await machine.connect(minter).safeMint("nft1.com", 1)).to.emit(machine, "Transfer");

  //   // Chủ sở hữu đặt NFT lên sàn
  //   await erc20.approve(machine.target, tokenId);
  //   await machine.listNftFromSeller(minter.address, tokenId, price);

  //   // Kiểm tra xem thông tin NFT đã được đặt lên sàn đúng cách hay không
  //   const nftListing = await machine.nfts(tokenId);
  //   expect(nftListing.seller).to.equal(minter.address);
  //   expect(nftListing.price).to.equal(price);
  //   expect(nftListing.tokenId).to.equal(tokenId);
  //   expect(nftListing.isListed).to.equal(true);

  // });

});







