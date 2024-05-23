import dotenv from "dotenv";
dotenv.config();

export const config = {
  client_id: process.env.GITHUB_APP_CLIENT_ID || "",
  client_secret: process.env.GITHUB_APP_CLIENT_SECRET || "",
  redirect_uri: process.env.GITHUB_APP_REDIRECT_URI || "",
  proxy_url: process.env.APP_PROXY_URL || "",
  jwt_secret: process.env.JWT_SECRET || "",
};
