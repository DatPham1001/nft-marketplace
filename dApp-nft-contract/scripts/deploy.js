const hre = require("hardhat");
const { ethers } = hre;
const typechain = require("../src/types");
const { log } = require("console");
const fs = require('fs').promises;

async function main() {
  // prepare accounts
  const accounts = await ethers.getSigners();
  const minter = accounts[2];
  const buyer = accounts[1];
  console.log('prepare accounts');
  console.log('owner: ', minter.address);
  console.log('buyer: ', buyer.address);
  // // deploy erc20 and machine
  // const erc20 = await new typechain.MyERC20Token__factory(minter).deploy(minter.address);
  // console.log('erc20: ', erc20.target);
  // // saveFrontendFiles(erc20, "NFT");
  // const machine = await new typechain.NFTMachine__factory(minter).deploy(erc20.target);
  // console.log('machine: ', machine.target);
  // // saveFrontendFiles(machine, "Marketplace");

  // // mint token for buyer
  // let tx = await erc20.connect(minter).mint(buyer.address, 10);

  // console.log('tx mint token: ', tx.hash);

  // // set approve for machine
  // tx = await machine.connect(minter).setApprovalForAll(machine.target, true);
  // console.log('tx approve all for machine: ', tx.hash);
  deploy(minter, buyer);
  // reApprovealForAll(minter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deploy(minter, buyer) {
  const contractinfo = []
  // deploy erc20 and machine
  const erc20 = await new typechain.MyNFTToken__factory(minter).deploy(minter.address);
  console.log('erc20: ', erc20.target);
  contractinfo.push("const nftTokenContract = " + erc20.target)
  // saveFrontendFiles(erc20, "NFT");
  const machine = await new typechain.NFTMachine__factory(minter).deploy(erc20.target);
  console.log('machine: ', machine.target);
  contractinfo.push("const machineContract = " + machine.target)
  // saveFrontendFiles(machine, "Marketplace");
  // mint token for buyer
  let tx = await erc20.connect(minter).safeMint(buyer.address, 1000000000);
  console.log('tx mint token: "' + tx.hash);
  contractinfo.push("const minter = ", minter.address)
  // set approve for machine
  let tx2 = await machine.connect(minter).setApprovalForAll(machine.target, true);
  console.log('tx approve all for machine: ' + tx2.hash);
  contractinfo.push("const buyer = " + buyer.address)
  contractinfo.push("Verify shell npx hardhat verify " + machine.target + "--network sepolia --constructor-args .\scripts\arguments.js ")
  await fs.writeFile('contractinfo.txt', contractinfo.join("\n\n"));
  console.log('Deployment information written to contractinfo.txt');
}










