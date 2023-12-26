import { ethers } from 'hardhat';
import { use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { BigNumberish, PayableOverrides, utils, ContractTransaction } from 'ethers'
import { expect } from 'chai'

import { MyNFT } from '../typechain-types/contracts/NFT.sol';

use(solidity);


let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress
describe("NFT", async () => {
  let nft: MyNFT

  beforeEach(async () => {
    const NFT = await ethers.getContractFactory("MyNFT")
    nft = await NFT.deploy() as MyNFT;
    nft.deployed();
    const accounts = await ethers.getSigners();
    owner = accounts[0]
    addr1 = accounts[1]
    addr2 = accounts[2]
  })

  it("Create NFT", async () => {
    await nft.connect(owner).createCollection()
    await expect(nft.connect(owner).createNFT(0, 10, owner.address, "")).not.to.be.rejected
    await expect(nft.connect(addr1).createNFT(0, 10, owner.address, "")).to.be.rejected
    await expect(nft.connect(owner).createNFT(0, 10, owner.address, "")).not.to.be.rejected
    await expect(nft.connect(owner).createNFT(1, 10, owner.address, "")).to.be.rejectedWith("Collection is not exits!")
  })
  it("Approve For All", async () => {
    await nft.connect(owner).createCollection()
    await expect(nft.connect(owner).createNFT(0, 2, owner.address, "")).not.to.be.rejected
    await expect(nft.connect(owner).approveForAll(addr1.address, 1)).to.be.rejectedWith("Collection is not exits!")
    await expect(nft.connect(owner).approveForAll(addr1.address, 0)).not.to.be.rejected
    let address1 = await nft.connect(owner).getApproved(0)
    let address2 = await nft.connect(owner).getApproved(1)
    await expect(address1.toString()).to.eql(addr1.address)
    await expect(address2.toString()).to.eql(addr1.address)
  })
})
