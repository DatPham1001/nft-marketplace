// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as dotenv from "../config/config.env"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // ========== Contract Token Prize =============

  const fee = Number(dotenv.default.seller_fee)
  const addressReceiceFee = String(dotenv.default.receice_fee_address)

  const contractFactory = await ethers.getContractFactory("Factory");
  const ContractNFTFactory = await contractFactory.deploy();
  await ContractNFTFactory.deployed();

  const contractMarketPlace = await ethers.getContractFactory("NFTMarketplace");
  const ContractSale = await contractMarketPlace.deploy(fee, addressReceiceFee);
  await ContractSale.deployed();
  console.log("\"ADMIN_ADDRESS \":", "\"" + dotenv.default.address_owner + "\"");
  console.log("\"FACTORY_CONTRACT_ADDRESS\":", "\"" + ContractNFTFactory.address + "\"");
  console.log("\"MARKETPLACE_CONTRACT_ADDRESS\":", "\"" + ContractSale.address + "\"");

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
