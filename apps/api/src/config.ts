import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "jogeshwar123";
export const ADMIN_JWT_SECRET = JWT_SECRET + "admin";
export const USER_JWT_SECRET = JWT_SECRET + "user";