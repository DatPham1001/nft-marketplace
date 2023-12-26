import * as dotenv from "dotenv";

dotenv.config();

export default {
    address_owner: String(process.env.ADMIN_ADDRESS),
    token_address: process.env.TOKEN_ADDRESS,
    seller_fee: process.env.SELLER_FEE,
    receice_fee_address: process.env.ADMIN_ADDRESS,
}