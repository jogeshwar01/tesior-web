import axios from "axios";
import { config } from "../config";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", config.client_id);
  data.append("client_secret", config.client_secret);
  data.append("code", code);
  data.append("redirect_uri", config.redirect_uri);

  // Request to exchange code for an access token
  // Need to add code for refresh token - also enable on github first
  // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens

  try {
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const params = new URLSearchParams(tokenResponse.data);
    const access_token = params.get("access_token");

    // Request to return data of a user that has been authenticated
    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const token = jwt.sign({ user: userResponse.data, access_token: access_token }, config.jwt_secret);

    res.status(200).json({
      user_data: userResponse.data,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error });
  }
});

export default router;
