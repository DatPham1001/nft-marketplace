import { ethers } from "ethers";
import NFTLandingPagePage from "pages/NFTLandingPage";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Button, Img, Text } from "components";
import * as typechain from "nft-machine";
import fs from 'fs';
import Web3 from 'web3';
import { NavBar } from "components/NavBar";
import CreateNftPage from "pages/CreateNftPage";
import ContractABI from "../contractdata/ContractABI.json"
import ConfigFile from "../config.json"
// const nftTokenContract = "0x9C3fc11735c3B754CCa9e5FCe6a4aa4E8e4544ab"
// const machineContract = "0x53aeBBE1db026eA25a67Fe644d0E94Fa96a1aCb1"
// const minter = "0x392d672E6E4ba33e8AEe46C5A9e7B87d3c802A32"
// const buyer = "0x7493e77B6C2b9c550A6Fe4C392A24E1452EE65f1"
// const baseImgUrl = "https://ipfs.io/ipfs/"
// const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYmMxYzFhZC00MDg1LTQ0YTktYjAzZC1kYTJlYTk5NzA4ZDgiLCJlbWFpbCI6ImRhdHBoYW0uYnIzMWhuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjYzI5NjJlNGM5YjdmMmViOTlhOSIsInNjb3BlZEtleVNlY3JldCI6ImMyYmJlMjIwZWMwZmI1Yzg1YTZjZDcyOGIxNWVhNTY4Nzc3NzQ2MTVmMzZhYmZkZTYzMGQ5NjkwNjA0MzYyZjgiLCJpYXQiOjE3MDQxNjU3NzZ9.sk9_wyscWLbAcThXJnlA-73VtYl_AyLA_pmlcgXrT5c";

function App() {

  // const web3provider = new ethers.providers.Web3Provider(
  //   window.ethereum as any
  // );
  // const machine = typechain.NFTMachine__factory.connect(
  //   machineContract,
  //   web3provider as any  
  // );
  const web3 = new Web3(window.ethereum);
  
  const marketPlaceContract = new web3.eth.Contract(ContractABI, ConfigFile.machineContract);

  const params = {
    marketPlaceContract: marketPlaceContract,
    web3: web3,
    baseImgUrl: ConfigFile.baseImgUrl,
    pinataJwt: ConfigFile.pinataJwt
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
        </>
        <div>
          {/* {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : ( */}
          <Routes>
            <Route path="/" element={<NFTLandingPagePage params={params} />} />
            <Route path="/createNft" element={<CreateNftPage params={params} />} />
            {/* <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } /> */}
          </Routes>
          {/* )} */}
        </div>
      </div>
      <div className="text-center text-gray-600 mt-8">
        © 2023 Your Company. All rights reserved.
      </div>
    </BrowserRouter>
  )

}

export default App;
