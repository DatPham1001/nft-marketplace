import React, { useEffect } from 'react'
import { MetaMaskButton, useAccount, useSDK, useSignMessage } from "@metamask/sdk-react-ui";
import { Button, Img, Text } from "../components";
import { useNavigate } from 'react-router-dom';
type Props = {
	children: React.ReactNode
}

const Layout = ({ children }: Props) => {
	const navigate = useNavigate()
	const { isConnected } = useAccount();
	const { sdk ,connected, connecting, } = useSDK()
	console.log('isConnected', isConnected);
	useEffect(() => {
		const connectAndSign = async () => {
			try {
				const signResult = await sdk?.connectAndSign({
					msg: 'Connect + Sign message'
				});
				console.log(signResult);
			} catch (err) {
				console.warn(`failed to connect..`, err);
			}
		};
	
		const connect = async () => {
			try {
				await sdk?.connect();
			} catch (err) {
				console.warn(`failed to connect..`, err);
			}
		};
		if (!isConnected) connect()
	}, [isConnected])
	const { ready } = useSDK();

	if (!ready) {
		return <div>Loading...</div>;
	}
	return (
		<>
			<header>
				{/* header */}
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
								onClick={() => navigate("/")}
							>
								Home
							</Text>
							<Text
								className="text-gray-900 text-lg w-auto"
								size="txtPoppinsMedium18Gray900"
								onClick={() => navigate("/listOrder")}
							>
								List Orders
							</Text>
							<Text
								className="text-gray-900 text-lg w-auto"
								size="txtPoppinsMedium18Gray900"
								onClick={() => navigate("/createNft")}
							>
								Create Nft
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
					// onClick={connectWallet}
				>
					<div className="font-medium leading-[normal] text-left text-lg">
						Connect Wallet
					</div>
				</Button> */}
						<MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
					</div>
				</div>
			</header>
			{children}
		</>
	)
}

export default Layout
