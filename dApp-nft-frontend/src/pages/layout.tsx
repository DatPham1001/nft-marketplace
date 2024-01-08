import React, { useEffect, useState } from 'react'
import { MetaMaskButton, useAccount, useSDK, useSignMessage } from "@metamask/sdk-react-ui";
import { Button, Img, Text } from "../components";
import { useNavigate } from 'react-router-dom';
type Props = {
	children: React.ReactNode
}
import ConfigFile from "../../config.json";
import { Link, NavLink, Router } from "react-router-dom";
const Layout = ({ children }: Props) => {
	const navigate = useNavigate()
	const { isConnected } = useAccount();
	const { sdk, connected, connecting, } = useSDK()
	// console.log('isConnected', isConnected);
	const [accounts, setAccounts] = useState([]);
	useEffect(() => {
		window.ethereum
			.request({ method: 'eth_requestAccounts', })
			.then((accounts) => {
				setAccounts(accounts)
			})

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
							<div className="flex md:flex-1 md:flex-col flex-row font-poppins md:gap-10 gap-16 items-center justify-start md:pr-10 pr-32 sm:pr-5 pt-12 w-auto md:w-full">
								<div className="flex flex-row gap-16 items-start justify-start w-auto">

									<nav className="flex md:flex-1 md:flex-col flex-row font-poppins md:gap-10 gap-16 items-center justify-start md:pr-10 pr-32 sm:pr-5 pt-12 w-auto md:w-full">
										<NavLink exact to="/" className="text-lg text-purple-A200 w-auto"
											size="txtPoppinsMedium18">
											Home
										</NavLink>
										{
											((accounts[0] ? accounts[0].toLowerCase() : "") == ConfigFile.minter.toLowerCase())
											&&
											<NavLink exact to="/admin-manager" className="text-lg text-purple-A200 w-auto"
												size="txtPoppinsMedium18">Admin</NavLink>
										}
										<NavLink exact to="/createNft" className="text-lg text-purple-A200 w-auto"
											size="txtPoppinsMedium10">Create NFT</NavLink>
										<NavLink exact to="/listOrder" className="text-lg text-purple-A200 w-auto"
											size="txtPoppinsMedium18">List Orders</NavLink>
									</nav>
								</div>
								<MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
							</div>
						</div>
					</div>
				</div >
			</header>
			{children}
		</>
	)
}

export default Layout
