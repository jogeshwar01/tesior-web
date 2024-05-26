import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "your-jwt-secret";
export const ADMIN_JWT_SECRET = JWT_SECRET + "admin";
export const USER_JWT_SECRET = JWT_SECRET + "user";
export const PARENT_WALLET_ADDRESS =
  process.env.PARENT_WALLET_ADDRESS ?? "your-public-key";
export const RPC_URL = process.env.RPC_URL ?? "http://localhost:8899";
export const TOTAL_DECIMALS = 1000000000;
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "your-private-key";
