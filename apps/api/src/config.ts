import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "your-jwt-secret";
export const ADMIN_JWT_SECRET = JWT_SECRET + "admin";
export const USER_JWT_SECRET = JWT_SECRET + "user";
export const PARENT_WALLET_ADDRESS = process.env.PARENT_WALLET_ADDRESS ?? "your-public-key";
export const RPC_URL = process.env.RPC_URL ?? "http://localhost:8899";
export const TOTAL_DECIMALS = 1000000000;

export const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379");
export const REDIS_CONNECTION = { host: REDIS_HOST, port: REDIS_PORT, };

export const SHARES = Number(process.env.SHARES) ?? 5;
export const THRESHOLD = Number(process.env.THRESHOLD) ?? 3;

export const SERVER_1_ENDPOINT = process.env.SERVER_1_ENDPOINT ?? "http://localhost:8000";
export const SERVER_2_ENDPOINT = process.env.SERVER_2_ENDPOINT ?? "http://localhost:8001";
export const SERVER_3_ENDPOINT = process.env.SERVER_3_ENDPOINT ?? "http://localhost:8002";
export const SERVER_4_ENDPOINT = process.env.SERVER_4_ENDPOINT ?? "http://localhost:8003";
export const SERVER_5_ENDPOINT = process.env.SERVER_5_ENDPOINT ?? "http://localhost:8004";

export const DISTRIBUTED_SERVER_ENDPOINTS = [
  SERVER_1_ENDPOINT,
  SERVER_2_ENDPOINT,
  SERVER_3_ENDPOINT,
  SERVER_4_ENDPOINT,
  SERVER_5_ENDPOINT,
];
