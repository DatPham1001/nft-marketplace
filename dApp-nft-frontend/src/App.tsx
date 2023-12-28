import { ethers } from "ethers";
import NFTLandingPagePage from "pages/NFTLandingPage";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import * as typechain from "nft-machine";
import fs from 'fs';
const nftTokenContract = "0x9C3fc11735c3B754CCa9e5FCe6a4aa4E8e4544ab"
const machineContract = "0x066c81B6E955C52aC73f300E2DB16F6e71214bA8"
const minter = "0x392d672E6E4ba33e8AEe46C5A9e7B87d3c802A32"
const buyer = "0x7493e77B6C2b9c550A6Fe4C392A24E1452EE65f1"
const baseImgUrl = "https://ipfs.io/ipfs/QmS3zvibSk9DSHLZ1oLbaaCVWNwhaYqqbiE99giBAVGYQE/"


function App() {

  const web3provider = new ethers.providers.Web3Provider(
    window.ethereum as any
  );
  const machine = typechain.NFTMachine__factory.connect(
    machineContract,
    web3provider as any
  );

  const params = {
    machine: machine,
    web3provider: web3provider,
    baseImgUrl: baseImgUrl
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          {/* <Navigation web3Handler={web3Handler} account={account} /> */}
        </>
        <div>
          {/* {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : ( */}
          <Routes>
            <Route path="/" element={
              <NFTLandingPagePage params={params} />
            } />
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
    </BrowserRouter>
  )

}

export default App;
