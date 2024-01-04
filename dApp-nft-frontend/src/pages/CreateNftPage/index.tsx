import React, { useEffect, useState } from "react";

import { Text } from "components";
import NFTLandingPageStack from "components/NFTLandingPageStack";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import * as typechain from "nft-machine";
import { log } from "console";
import { Link, NavLink, Router } from "react-router-dom";
import { NavBar } from "components/NavBar";
import "../../styles/style.css"
interface Attribute {
  key: string;
  value: string;
}
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormData from 'form-data';
import axios from 'axios';
import ConfigFile from "../../../config.json";
import { useNavigate } from 'react-router-dom';
const CreateNftPage = ({ params }) => {
  // const [machine, setmachine] = useState();
  // const [baseImageUrl, setbaseImageUrl] = useState(params.baseImageUrl);
  const marketPlaceContract = params.marketPlaceContract;
  const baseImgUrl = ConfigFile.baseImgUrl;
  const [listNft, setListNft] = useState([]);
  const [isLoading, setIsLoading] = useState([])
  const [mintError, setMintError] = useState("");
  const [transactionHash, setTransactionHash] = useState();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const navigateTo = useNavigate();
  useEffect(() => {
    window.ethereum
      .request({ method: 'eth_requestAccounts', })
      .then((accounts) => {
        setAccounts(accounts)
      })
  }, []);

  const [name, setName] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      setImageFile(selectedImage);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleAttributeChange = (index: number, key: string, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { key, value };
    setAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };
  function isNotNullOrEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }
  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleCreateNFT = async () => {
    // Upload image to IPFS
    try {
      let loadingToastId;
      setLoading(true);
      if (accounts.length == 0) {
        throw new Error('Please connect to your wallet');
      }
      console.log(accounts[0]);
      if (accounts[0].toLowerCase() != ConfigFile.minter.toLowerCase()) {
        throw new Error('You do not have permission to create NFT');
      }
      if (!isNotNullOrEmpty(name)) {
        throw new Error('Name is required');
      }

      if (!isNotNullOrEmpty(imageFile)) {
        throw new Error('Image is required');
      }

      loadingToastId = toast.info('Uploading Image to IPFS...', { position: 'bottom-right', autoClose: false });
      const imageIpfsUri = await uploadImageToIpfs(imageFile);
      // Prepare data for IPFS
      const nftData = {
        name,
        image: params.baseImgUrl + imageIpfsUri,
        attributes,
      };
      // Upload data to IPFS
      toast.dismiss(loadingToastId);
      loadingToastId = toast.info('Uploading data to IPFS...', { position: 'bottom-right', autoClose: false });
      const nftIpfsUri = await pinJSONToIPFS(nftData);
      const mintingParameters = {
        from: accounts[0], // Wallet address that will initiate the transaction
        gas: 2000000, // Adjust gas according to your contract requirements
      };
      toast.dismiss(loadingToastId);
      toast.info('Minting...', { position: 'bottom-right', autoClose: false });
      // // // Call the mint NFT function with the IPFS URI
      console.log(marketPlaceContract.methods);
      const mintResult = await marketPlaceContract.methods.mintNewNFT(baseImgUrl + nftIpfsUri).send(mintingParameters);
      console.log(mintResult);
      setMintError(null);
      setTransactionHash(mintResult.transactionHash);
      // Show success notification
      toast.dismiss(loadingToastId);
      toast.success('NFT minted successfully!', { position: 'bottom-right' });
      setTimeout(() => {
        navigateTo('/');
      }, 2000);
      setLoading(false);
    } catch (error) {
      // An error occurred during the transaction
      toast.dismiss();
      setLoading(false);
      console.error(error);
      toast.error(error.message, { position: 'bottom-right' });
      if (error.error.code != 200) {
        setMintError(error.error.message);
      } else
        setMintError('Failed to mint NFT. Please check the console for details.');
      setTransactionHash(null);
      toast.error(error.error.message, { position: 'bottom-right' });
    }
  };

  const uploadImageToIpfs = async (file: File | null) => {
    const formData = new FormData();
    // Assuming 'file' is an instance of the File class
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);
    formData.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });
    // try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary}`,
          Authorization: `Bearer ${params.pinataJwt}`,
        },
      }
    );
    console.log(res.data);
    return res.data.IpfsHash;
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const pinJSONToIPFS = async (nftData) => {

    const data = JSON.stringify({
      pinataContent: nftData,
      pinataMetadata: {
        name: "metadata.json"
      }
    })
    console.log(data);

    // try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.pinataJwt}`
      }
    });
    console.log(res.data);
    return res.data.IpfsHash
    // } catch (error) {
    // console.log(error);
    // }
  }


  return (
    <>
      <div
        className={`bg-gray-100 flex flex-col font-poetsenone items-end justify-start mx-auto pb-[94px] md:pl-10 sm:pl-5 pl-[94px] w-full`}
      >
        <div className="flex flex-col items-start justify-start w-[98%] md:w-full">
          <div className="flex md:flex-col flex-row md:gap-10 items-end justify-between w-full">
            <div className="flex flex-col items-center justify-start md:mt-0 mt-12">
              <Text
                className="backdrop-opacity-[0.5] blur-[15.00px] text-5xl sm:text-[38px] md:text-[44px] text-purple-A200"
                size="txtPoetsenOneRegular48"
              >
                NFT
              </Text>
              <Text
                className="text-5xl sm:text-[38px] md:text-[44px] text-purple-A200"
                size="txtPoetsenOneRegular48"
              >
                NFT
              </Text>
            </div>
            <NavBar></NavBar>
          </div>
        </div>
      </div>
      <div className="font-poppins gap-16 md:gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 min-h-[auto] mt-[248px] w-[91%] mx-auto bg-pink-100 p-8 rounded-lg shadow-lg">
        <div className="col-span-1">
          <label className="text-xl text-pink-800 mb-2 block">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-pink-300 rounded-md p-2 w-full focus:outline-none focus:border-pink-500"
            />
          </label>

          <label className="text-xl text-pink-800 mb-2 block">
            Attributes:
            <ul>
              {attributes.map((attr, index) => (
                <li key={index} className="mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, e.target.value, attr.value)}
                    className="border-2 border-pink-300 rounded-md p-2 mr-2 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, attr.key, e.target.value)}
                    className="border-2 border-pink-300 rounded-md p-2 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    className="bg-pink-500 text-white rounded-md p-2 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="bg-pink-500 text-white rounded-md p-2 mt-2"
            >
              Add Attribute
            </button>
          </label>
        </div>

        <div className="col-span-1">
          <label className="text-xl text-pink-800 mb-2 block">
            Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border-2 border-pink-300 rounded-md p-2 w-full focus:outline-none focus:border-pink-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-pink-800 font-bold">Image Preview:</p>
                <img src={imagePreview} alt="Preview" className="max-w-full mt-2" />
              </div>
            )}
          </label>
        </div>
        {
          // !loading && 
          <button
            type="button"
            onClick={handleCreateNFT}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            className="bg-pink-500 text-white rounded-md p-2 mt-4 col-span-3"
          >
            Create NFT
          </button>
        }

        {/* {transactionHash && <p>Transaction Hash: {transactionHash}</p>} */}
        {/* {mintError && <p style={{ color: 'red' }}>{mintError}</p>} */}
        <ToastContainer />
      </div>

    </>
  );
};

export default CreateNftPage;
