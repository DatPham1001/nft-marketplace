const hre = require("hardhat");
const { ethers } = hre;
const typechain = require("../src/types");
const { log } = require("console");

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
  deploy(minter,buyer);
  // reApprovealForAll(minter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deploy(minter,buyer){
    // deploy erc20 and machine
  const erc20 = await new typechain.MyERC20Token__factory(minter).deploy(minter.address);
  console.log('erc20: ', erc20.target);
  // saveFrontendFiles(erc20, "NFT");
  const machine = await new typechain.NFTMachine__factory(minter).deploy(erc20.target);
  console.log('machine: ', machine.target);
  // saveFrontendFiles(machine, "Marketplace");
  // mint token for buyer
  let tx = await erc20.connect(minter).mint(buyer.address, 10);

  console.log('tx mint token: ', tx.hash);

  // set approve for machine
  tx = await machine.connect(minter).setApprovalForAll(machine.target, true);
  console.log('tx approve all for machine: ', tx.hash);
}
//if approval failed
async function reApprovealForAll(minter) {
  const contractAddress = "0x5e401651572df3D3fEcA4aF502c090933a995b8C";
  const myContract = await hre.ethers.getContractAt("NFTMachine", contractAddress);
  // const machine = new typechain.NFTMachine__factory(minter).connect(minter)
  console.log(machine);

}
function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "../contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}










