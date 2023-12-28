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

const CreateNftPage = ({ params }) => {
  // const [machine, setmachine] = useState();
  // const [baseImageUrl, setbaseImageUrl] = useState(params.baseImageUrl);
  const machine = params.machine;
  const baseImgUrl = params.baseImgUrl;
  const [listNft, setListNft] = useState([]);
  const [isLoading, setIsLoading] = useState([])

  useEffect(() => {

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

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleCreateNFT = async () => {
    // Upload image to IPFS
    const imageIpfsUri = await uploadToIpfs(imageFile);

    // Prepare data for IPFS
    const nftData = {
      name,
      image: imageIpfsUri,
      attributes,
    };

    // Upload data to IPFS
    const nftIpfsUri = await uploadToIpfs(JSON.stringify(nftData));

    // Call the mint NFT function with the IPFS URI
    mintNFT(nftIpfsUri);
  };

  const uploadToIpfs = async (file: File | null) => {
    // Implementation for uploading to IPFS goes here
    // You can use libraries like ipfs-http-client or any other IPFS library
    // Example:
    // const ipfs = createIpfsClient();
    // const result = await ipfs.add(file);
    // return result.path;
    return 'fakeIpfsUri';
  };

  const mintNFT = (ipfsUri: string) => {
    // Implement the mint NFT function to upload data to the blockchain
    // This function will be specific to the blockchain you are using
    // Example:
    // blockchainMintFunction(ipfsUri);
  };


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


        <button
          type="button"
          onClick={handleCreateNFT}
          className="bg-pink-500 text-white rounded-md p-2 mt-4 col-span-3"
        >
          Create NFT
        </button>
      </div>

    </>
  );
};

export default CreateNftPage;
