import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ABI from "contractABI.json";
import { Button, Img, Text } from "components";
import { useAccount, useSDK } from '@metamask/sdk-react-ui';

const DetailNFT = ({ params }) => {
	const parameter = useParams()
	const [data, setData] = useState(null)
	const {address} = useAccount();
	const machineContract = params.contractAddress;
	useEffect(() => {
		const getNFTsListOrder = async () => {
			try {
				// const web3provider = new ethers.providers.Web3Provider(
				//   window.ethereum as any
				// );
				// const machine = typechain.NFTMachine__factory.connect(
				//   machineContract,
				//   web3provider as any
				// );

				// const nftList = await machindata?.getAllNFT();
				// console.log(nftList);
				const rpcUrl = 'https://rpc.sepolia.org';
				const provider = new ethers.providers.JsonRpcProvider(rpcUrl || window.ethereum as any)

				const contractNFT = new ethers.Contract(
					machineContract,
					ABI,
					provider,
				)
				const nft = await contractNFT.orderIdtoOrder(parameter.id)
				console.log('nft', nft);
				const orderId = nft['orderId'].toString();
				const tokenId = nft['tokenId'].toString();
				const seller = nft['seller'].toString();
				const priceInWei = nft['priceInWei'].toString();
				setData({
					tokenId: tokenId,
					orderId: orderId,
					priceInWei: priceInWei,
					seller: seller
				})
			} catch (error) {
				console.log(error);
			}
		};
		getNFTsListOrder()
	}, []);
	const buyNFT = async () => {
		try {
			const rpcUrl = 'https://rpc.sepolia.org';
			const provider = new ethers.providers.JsonRpcProvider(rpcUrl || window.ethereum as any);
			// await provider.send('eth_requestAccounts', []);
			// const wallet = new ethers.Wallet(privkey, provider);
			// const signer = wallet.provider.getSigner();
			const contractNFT = new ethers.Contract(
				machineContract,
				ABI,
				provider,
			)
			console.log('contractNFT',contractNFT);
			const nft = await contractNFT.buyNFT(data.orderId);
				//  const nft = await contractNFT.getAllOrders();
			
		} catch (error) {
			console.log(error);
		}
	}
	const cancelOrder = async () => {
		try {
			const rpcUrl = 'https://rpc.sepolia.org';
			const provider = new ethers.providers.JsonRpcProvider(rpcUrl || window.ethereum as any)
			const contractNFT = new ethers.Contract(
				machineContract,
				ABI,
				provider,
			)
			const nft = await contractNFT.cancelOrder(data.orderId);
			console.log('nft',nft);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="bg-gray-100 flex h-[70vh] items-center justify-center gap-20 p-3.5 rounded-[30px] shadow-bs w-full">
			<div className="flex flex-col gap-4 items-start justify-start mt-2.5 w-[304px]">
				<div className="bg-purple-A200 flex flex-col items-end justify-start pt-2 px-2 rounded-[20px] w-full">
					<div className="flex flex-col items-center justify-start mr-[52px] w-[56%] md:w-full">
						<Img
							className="h-[232px] md:h-auto object-cover w-full"
							src={data?.img}
							alt="TwentyOne"
						/>
					</div>
				</div>
			</div>
			<div className='flex flex-col items-center justify-center'>
				<div className="flex flex-row gap-2 items-start justify-start w-auto">
					<div className="bg-purple-A200 h-12 rounded-[50%] w-12"></div>
					<div className="flex flex-col items-start justify-center w-auto">
						<Text
							className="text-gray-900 text-lg w-auto"
							size="txtPoppinsSemiBold18"
						>
							{data?.name}
							{address}
						</Text>
						<Text
							className="text-gray-900_bf text-xs w-auto"
							size="txtPoppinsMedium12"
						>
							Created by Vuong Huu Hung
						</Text>
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
								{data?.priceInWei}
							</span>
						</Text>
					</div>
					<div className="flex flex-row gap-2 items-center justify-start w-[77px]">
						<Img
							className="h-6 w-6"
							src="images/img_phcrownsimpldata?.svg"
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
							// alt="credit-card"
						/>
					}
					color="purple_A200_cyan_A100"
				// onClick={() => buyNFT(data?.tokenId, data?.price)}
				onClick={() => address == data?.seller ? cancelOrder() : buyNFT()}
				>
					<div className="font-medium leading-[normal] text-[15px] text-left">
						{address === data?.seller ? 'Cancel' : 'Buy'}
					</div>
				</Button>
			</div>
		</div>
	)
}

export default DetailNFT