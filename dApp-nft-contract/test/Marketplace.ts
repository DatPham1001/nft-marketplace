import { ethers } from 'hardhat';
import { use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { BigNumberish, PayableOverrides, utils, ContractTransaction } from 'ethers'
import { expect } from 'chai'

import { NFTMarketplace } from '../typechain-types/contracts/Marketplace.sol';
import { MyNFT } from '../typechain-types/contracts/NFT.sol';

use(solidity);


let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

ethers.getSigners().then((signers) => {
  owner = signers[0]
  addr1 = signers[1]
  addr2 = signers[2]
})

describe("marketplace ", async () => {
  let marketplace: NFTMarketplace
  let nft: MyNFT

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0]
    addr1 = accounts[1]
    addr2 = accounts[2]
    const Marketplace = await ethers.getContractFactory("NFTMarketplace")
    marketplace = await Marketplace.deploy("1000000000", owner.address) as NFTMarketplace;
    marketplace.deployed();

    const MyNFT = await ethers.getContractFactory("NFT")
    nft = await MyNFT.deploy() as MyNFT;
    nft.deployed();
  })


  // it("Sell NFT when not approved", async () => {
  //   //Create Collection
  //   await expect(nft.connect(owner).createCollection()).not.to.be.reverted;

  //   // Create NFT
  //   await expect(nft.connect(owner).createNFT(0, 10, owner.address, '')).not.to.be.reverted;

  //   await expect(marketplace.connect(owner).createMarketItemSale(nft.address, 0, '2000000000000000000')).to.be.revertedWith('The contract is not authorized to manage the asset');
  // })

})
