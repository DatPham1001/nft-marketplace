import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import NFTLandingPageStack from "components/NFTLandingPageStack";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import * as typechain from "nft-machine";
import { ethers } from "ethers";
import ABI from "contractABI.json";
import "../../styles/style.css"
//0xD4a77Bb3BeEaC1B0CE92d465Fb34c50Eacd8355E
//0x871010B2E49aCBfd0D1b9cbe28389c92d09f117B
//0xdb312b182Bf82072A0a1375faA08f591959E4414
const erc20Contract = "0xA80Bc339a70711d8a288d8d284857A47d1081E41";
const minter = "0x35DAb71CF51B02e130F5030799479748EA3da269";
const NFTLandingPagePage = ({ params }) => {
	const [listNft, setListNft] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	// const [selectedNft, setSelectedNft] = useState({ tokenId: "", name: "", image: "", attributes: [] });
	const [selectedNft, setSelectedNft] = useState(null);
	const machineContract = params.contractAddress;
	const marketPlaceContract = params.marketPlaceContract;
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		getNFTsList();
	}, []);

	const getNFTsList = async () => {
		let list = [];

		try {
			const nftList = await marketPlaceContract.methods.getAllNFT().call();
			console.log(nftList);
			let nfts = [];
			// nftList.map(async (e) => {
			//   const uri = e.attribute_url;
			//   try {
			//     const response = await fetch(uri);
			//     const metadata = await response.json();
			//     console.log(metadata);
			//     nfts.push({
			//       name: metadata.name,
			//       tokenId: e.tokenId,
			//       img: metadata.image,
			//       attributes: metadata.attributes
			//     });
			//   } catch (error) {
			//     console.log(error);
			//   }
			// })
			// setListNft(nfts.slice())
			// console.log(nfts);
			// } catch (error) {
			//   console.log(error);
			// }
			const removeIds = [];
			for (const nft of nftList) {
				const tokenId = nft[0].toString();
				if (removeIds.includes(tokenId))
					continue
				console.log(nft);

				const uri = nft.attribute_url;
				try {
					const response = await fetch(uri);
					const metadata = await response.json();
					nfts.push({
						name: metadata.name,
						tokenId: tokenId,
						img: metadata.image,
						attributes: metadata.attributes
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

	const buyNFT = async (tokenId, price) => {
		try {
			// const web3provider = new ethers.providers.Web3Provider(
			// 	window.ethereum as any
			// );
			// const machine = typechain.NFTMachine__factory.connect(
			// 	machineContract,
			// 	web3provider as any
			// );
			// const erc20 = typechain.MyERC20Token__factory.connect(erc20Contract, web3provider as any);
			// const tx = await erc20.connect((web3provider.getSigner()) as any).approve(machine.target, price);
			// await web3provider.waitForTransaction(tx.hash);
			// const tx2 = await machine.connect((web3provider.getSigner()) as any).buyNFT(tokenId);
			// await web3provider.waitForTransaction(tx2.hash);
			// alert("You bought a NFT");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="bg-gray-100 flex flex-col font-poetsenone items-end justify-start mx-auto pb-[94px] md:pl-10 sm:pl-5 pl-[94px] w-full">
				<div className="flex flex-col items-start justify-start w-[98%] md:w-full">
					{/* body */}
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
						{listNft.map((e, index) => (
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
												Created by Vuong Huu Hung
											</Text> */}
										</div>
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
									onClick={() => {
										setShowCreateModal(true)
										setSelectedNft(e);
										// console.log(index);
									}}
								>
									<div className="font-medium leading-[normal] text-[15px] text-left">
										Create Order
									</div>
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default NFTLandingPagePage;