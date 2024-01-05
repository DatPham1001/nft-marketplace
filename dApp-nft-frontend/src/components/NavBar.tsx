

import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { Link, NavLink, Router } from "react-router-dom";
import ConfigFile from "../../config.json";
import { Button, Img, Text } from "components";
import { useEffect, useState } from "react";
export function NavBar() {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    window.ethereum
      .request({ method: 'eth_requestAccounts', })
      .then((accounts) => {
        setAccounts(accounts)
      })
  }, []);
  return (

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
              size="txtPoppinsMedium18">Admin Manager</NavLink>
          }
          <NavLink exact to="/createNft" className="text-lg text-purple-A200 w-auto"
            size="txtPoppinsMedium18">Create NFT</NavLink>

          <NavLink exact to="/contact" className="text-lg text-purple-A200 w-auto"
            size="txtPoppinsMedium18">Contact</NavLink>
        </nav>
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
  );
}

