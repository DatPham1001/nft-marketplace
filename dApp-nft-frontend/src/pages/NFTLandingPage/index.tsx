import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import NFTLandingPageStack from "components/NFTLandingPageStack";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import * as typechain from "nft-machine";
import { log } from "console";


const NFTLandingPagePage = ({ params }) => {
  // const [machine, setmachine] = useState();
  // const [baseImageUrl, setbaseImageUrl] = useState(params.baseImageUrl);
  const machine = params.machine;
  const baseImgUrl = params.baseImgUrl;
  const [listNft, setListNft] = useState([]);
  const [isLoading, setIsLoading] = useState([])
  useEffect(() => {
    getNFTsList();

  }, []);
  const getNFTsList = async () => {
    let list = [];

    try {

      const nftList = await machine.getAllNFT();

      let arr = [];
      //       nftList.map(async (e) => {
      //         const uri = e[2].toString();
      //         // arr.push(fetch(uri))
      // // const 

      //       });
      //       const arrResponse = await Promise.all(arr);
      //       arrResponse.map((e, index) => {
      //         const tokenId = nftList[index][0].toString();
      //         const price = nftList[index][1].toString();
      //         const metadata = e.json();
      //         list.push({
      //           name: metadata.name,
      //           tokenId: tokenId || "",
      //           price: price || "",
      //           img: metadata?.imgUrl,
      //         });
      //       })
      let nfts = [];
      const removeIds = ["0", "1", "2", "3","4","5"];
      for (const nft of nftList) {
        const tokenId = nft[0].toString();
        if (removeIds.includes(tokenId))
          continue
        const price = nft[1].toString();
        const uri = nft[2].toString();
        try {
          const response = await fetch(uri);
          const metadata = await response.json();
          nfts.push({
            name: metadata.name,
            tokenId: tokenId,
            price: price,
            img: metadata.image,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setListNft(nfts.slice())
      console.log(nfts);
    } catch (error) {
      console.log(error);
    }


  };



  return (
    <>
      <div className="bg-gray-100 flex flex-col font-poetsenone items-end justify-start mx-auto pb-[94px] md:pl-10 sm:pl-5 pl-[94px] w-full">
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
            <div className="flex md:flex-1 md:flex-col flex-row font-poppins md:gap-10 gap-16 items-center justify-start md:pr-10 pr-32 sm:pr-5 pt-12 w-auto md:w-full">
              <div className="flex flex-row gap-16 items-start justify-start w-auto">
                <Text
                  className="text-lg text-purple-A200 w-auto"
                  size="txtPoppinsMedium18"
                >
                  Home
                </Text>
                <Text
                  className="text-gray-900 text-lg w-auto"
                  size="txtPoppinsMedium18Gray900"
                >
                  Explore
                </Text>
                <Text
                  className="text-gray-900 text-lg w-auto"
                  size="txtPoppinsMedium18Gray900"
                >
                  How it works
                </Text>
              </div>

              {/* <Button
                className="bg-transparent cursor-pointer flex items-center justify-center min-w-[238px]"
                variant="outline"
                color="purple_A200_cyan_A100"
              >
                <div className="font-medium leading-[normal] text-left text-lg">
                  Connect Wallet
                </div> */
                // </Button>
              }
              <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
            </div>
          </div>
          <div className="font-poppins md:h-[656px] h-[683px] mt-[26px] relative w-[96%] md:w-full">
            <div className="absolute bottom-[16%] flex flex-col h-[385px] md:h-auto items-start justify-center left-[0] w-[454px] sm:w-full">
              <div className="flex flex-col gap-2 items-start justify-center w-auto sm:w-full">
                <Text
                  className="bg-clip-text bg-gradient  leading-[64.00px] md:text-5xl text-[64px] text-transparent"
                  size="txtPoppinsExtraBold64"
                >
                  <>
                    Collect,
                    <br />
                    Sell & Trade
                    <br />
                    NFT’s
                  </>
                </Text>
                <Text
                  className="text-gray-900_bf text-lg w-auto"
                  size="txtPoppinsMedium18Gray900bf"
                >
                  Collect, Explore & Create Digital Art NFT’s
                </Text>
              </div>
            </div>
            <div className="absolute md:h-[630px] h-[683px] inset-y-[0] my-auto right-[0] w-[66%] md:w-full">
              <div className="absolute h-[631px] left-[0] top-[0] w-[47%] sm:w-full">
                <Img
                  className="h-[272px] mb-[-19px] ml-auto mr-[15px] object-cover w-[70%] z-[1]"
                  src="images/img_07gearnft_272x265.png"
                  alt="07gearnft_One"
                />
                <Img
                  className="h-[378px] mt-auto mx-auto object-cover w-full"
                  src="images/img_07gearnft.png"
                  alt="07gearnft"
                />
              </div>
              <div className="absolute bottom-[0] h-[630px] right-[0] w-[81%] md:w-full">
                <div className="h-[630px] m-auto w-full">
                  <Img
                    className="h-[630px] m-auto object-cover w-full"
                    src="images/img_07gearnft_630x658.png"
                    alt="07gearnft_Two"
                  />
                  <Img
                    className="absolute bottom-[14%] h-[129px] left-[39%] object-cover w-[14%]"
                    src="images/img_07gearnft_129x92.png"
                    alt="07gearnft_Three"
                  />
                </div>
                <Img
                  className="absolute bottom-[7%] h-[234px] object-cover right-[17%] w-[37%]"
                  src="images/img_07gearnft_234x238.png"
                  alt="07gearnft_Four"
                />
              </div>
            </div>
          </div>
          <div className="font-poppins gap-16 md:gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 min-h-[auto] mt-[248px] w-[91%]">
            {listNft.map((e) => {
              return (
                <div className="bg-gray-100 flex flex-col items-center justify-end p-3.5 rounded-[30px] shadow-bs w-full">
                  <div className="flex flex-col gap-4 items-start justify-start mt-2.5 w-[304px]">
                    <div className="bg-purple-A200 flex flex-col items-end justify-start pt-2 px-2 rounded-[20px] w-full">
                      <div className="flex flex-col items-center justify-start mr-[52px] w-[56%] md:w-full">
                        <Img
                          className="h-[232px] md:h-auto object-cover w-full"
                          src={e.img}
                          alt="TwentyOne"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 items-start justify-start w-auto">
                      <div className="bg-purple-A200 h-12 rounded-[50%] w-12"></div>
                      <div className="flex flex-col items-start justify-center w-auto">
                        <Text
                          className="text-gray-900 text-lg w-auto"
                          size="txtPoppinsSemiBold18"
                        >
                          {e.name}
                        </Text>
                        {/* <Text
                        className="text-gray-900_bf text-xs w-auto"
                        size="txtPoppinsMedium12"
                      >
                        Created by John Doe
                      </Text> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-start justify-center mt-[18px] w-[304px]">
                    <div className="flex flex-row gap-2 items-center justify-start w-[99px]">
                      <Img
                        className="h-6 w-6"
                        src="images/img_phcurrencyeth.svg"
                        alt="phcurrencyeth"
                      />
                      <Text
                        className="text-[15px] text-gray-900 w-auto"
                        size="txtPoppinsMedium15"
                      >
                        <span className="text-gray-900 font-poppins text-left font-medium">
                          {e.price}
                        </span>
                        <span className="text-gray-900_7f font-poppins text-left font-medium">
                          ETH
                        </span>
                      </Text>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-start w-[77px]">
                      <Img
                        className="h-6 w-6"
                        src="images/img_phcrownsimple.svg"
                        alt="phcrownsimple"
                      />
                      <Text
                        className="text-[15px] text-gray-900 w-auto"
                        size="txtPoppinsMedium15"
                      >
                        <span className="text-gray-900 font-poppins text-left font-medium">
                          1/
                        </span>
                        <span className="text-gray-900_7f font-poppins text-left font-medium">
                          100
                        </span>
                      </Text>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-start w-[91px]">
                      <Img
                        className="h-6 w-6"
                        src="images/img_clock.svg"
                        alt="clock"
                      />
                      <Text
                        className="text-[15px] text-gray-900 w-auto"
                        size="txtPoppinsMedium15"
                      >
                        <span className="text-gray-900 font-poppins text-left font-medium">
                          13d{" "}
                        </span>
                        <span className="text-gray-900_7f font-poppins text-left font-medium">
                          2h
                        </span>
                      </Text>
                    </div>
                  </div>
                  <Button
                    className="cursor-pointer flex items-center justify-center min-w-[304px] mt-[27px] rounded-[28px]"
                    leftIcon={
                      <Img
                        className="h-6 mr-4"
                        src="images/img_creditcard.svg"
                        alt="credit-card"
                      />
                    }
                    color="purple_A200_cyan_A100"
                  >
                    <div className="font-medium leading-[normal] text-[15px] text-left">
                      Place Bid
                    </div>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTLandingPagePage;
