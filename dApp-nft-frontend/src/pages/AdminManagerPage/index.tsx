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
import { AiFillDelete, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineCloseSquare } from 'react-icons/ai';

const AdminManagerPage = ({ params }) => {
    // const [machine, setmachine] = useState();
    // const [baseImageUrl, setbaseImageUrl] = useState(params.baseImageUrl);
    const marketPlaceContract = params.marketPlaceContract;
    const baseImgUrl = ConfigFile.baseImgUrl;
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [screenError, setScreenError] = useState("");
    const [name, setName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        window.ethereum
            .request({ method: 'eth_requestAccounts', })
            .then((accounts) => {
                setAccounts(accounts)
            })

        fetchAdmin();
    }, []);
    const fetchAdmin = async () => {
        const adminData = await marketPlaceContract.methods.getAllAdmin().call()
        console.log(adminData);
        let admins = [];
        for (const admin of adminData) {
            console.log(admin);
            try {
                admins.push({
                    name: admin.adminName,
                    address: admin.adminAddress,
                    status: admin.status
                });
            } catch (error) {
                console.log(error);
            }
        }
        setAdmins(admins);
    };
    const handleAddAdmin = async () => {
        try {
            setLoading(true);
            if (accounts[0].toLowerCase() != ConfigFile.minter.toLowerCase()) {
                throw new Error('You do not have permission to add admin');
            }
            if (!isNotNullOrEmpty(name)) {
                throw new Error('Name is required');
            }

            if (!isNotNullOrEmpty(walletAddress)) {
                throw new Error('WalletAddress is required');
            }
            const mintingParameters = {
                from: accounts[0], // Wallet address that will initiate the transaction
                gas: 2000000, // Adjust gas according to your contract requirements
            };

            toast.info('Creating admin...', { position: 'bottom-right', autoClose: false });
            const result = await marketPlaceContract.methods.addAdmin(walletAddress, name).send(mintingParameters);
            toast.dismiss()
            // console.log(result);
            await fetchAdmin();
            toast.success('Admin created successfully!', { position: 'bottom-right' });
            setTimeout(() => {
                setLoading(false);
                setName('');
                setWalletAddress('');
                setShowAddAdminModal(false);
            }, 2000);
        } catch (error) {
            // An error occurred during the transaction
            toast.dismiss();
            setLoading(false);
            console.error(error);
            toast.error(error.message, { position: 'bottom-right' });
            if (error.error.code != 200) {
                setScreenError(error.error.message);
            } else
                setScreenError('Failed Please check the console for details.');
            toast.error(error.error.message, { position: 'bottom-right' });
        }
    };
    function isNotNullOrEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

    const handleRemoveAdmin = async (index: number) => {
        // Call smart contract function to remove admin
        // await removeAdmin(admins[index].walletAddress);

        // // Fetch updated data after removing admin
        // const updatedAdmins = await fetchAdmins();
        // setAdmins(updatedAdmins);
    };

    const handleToggleAdminStatus = async (index: number) => {
        // Call smart contract function to toggle admin status
        // await toggleAdminStatus(admins[index].walletAddress);

        // // Fetch updated data after toggling admin status
        // const updatedAdmins = await fetchAdmins();
        // setAdmins(updatedAdmins);
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
            <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-screen-xl px-8">
                <div className="flex justify-between items-center mb-4 w-full">
                    <h1 className="text-3xl font-bold">Admin Manager</h1>
                    <button
                        onClick={() => setShowAddAdminModal(true)}
                        className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:border-pink-300"
                    >
                        Add Admin
                    </button>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="py-2 text-center">Index</th>
                            <th className="py-2 text-center">Name</th>
                            <th className="py-2 text-center">Wallet Address</th>
                            <th className="py-2 text-center">Status</th>
                            <th className="py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index) => (
                            <tr
                                key={admin.address}
                                className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} transition hover:bg-pink-100`}
                            >
                                <td className="py-2 text-center">{index + 1}</td>
                                <td className="py-2 text-center">{admin.name}</td>
                                <td className="py-2 text-center">{admin.address}</td>
                                <td className="py-2 text-center">{admin.status}</td>
                                <td className="py-2 text-center">
                                    <button
                                        onClick={() => handleRemoveAdmin(index)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                        title="Remove Admin"
                                    >
                                        <AiFillDelete className="text-xl" style={{ fontSize: '24px' }} />
                                    </button>
                                    <button
                                        title={admin.status === 'N' ? 'Activate Admin' : 'Deactivate Admin'}
                                        onClick={() => handleToggleAdminStatus(index)}
                                        className="text-green-500 hover:text-green-700 focus:outline-none"
                                    >
                                        {admin.status === 'N' ?
                                            <AiOutlineCheckCircle style={{ fontSize: '24px', color: 'green' }} className="text-xl" />
                                            : <AiOutlineCloseSquare style={{ fontSize: '24px', color: 'red' }} className="text-xl" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>
            <ToastContainer />
            <div>
                {showAddAdminModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000 /* Ensure the modal is above other elements */
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)', /* Background overlay with higher opacity */
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: -1 /* Place behind the modal */
                            }}
                        ></div>

                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                position: 'relative',
                                outline: '2px solid pink', /* Outline for the modal */
                                borderRadius: '8px', /* Optional: Add rounded corners */
                                opacity: 1 /* Set the opacity of the modal */
                            }}
                        >
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: 'pink'
                                }}
                                onClick={() => setShowAddAdminModal(false)}
                            >
                                X
                            </button>

                            <h2>Add Admin</h2>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-2 border-pink-300 rounded-md p-2 w-full focus:outline-none focus:border-pink-500"
                                />
                            </label>
                            <br />
                            <label>
                                Wallet Address:
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    className="border-2 border-pink-300 rounded-md p-2 w-full focus:outline-none focus:border-pink-500"
                                />
                            </label>
                            <br />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? '#ccc' : 'pink',
                                        color: 'white',
                                        padding: '8px 16px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        borderRadius: '4px',
                                        marginLeft: '8px'
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowAddAdminModal(false)}
                                    style={{
                                        backgroundColor: 'lightgray',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        marginLeft: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div>
        </>
    );
};

export default AdminManagerPage;
