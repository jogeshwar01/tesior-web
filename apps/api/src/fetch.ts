import express, { json } from "express";
import axios from "axios";
import cors from "cors";

import { config } from "./config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.post("/authenticate", (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", config.client_id);
  data.append("client_secret", config.client_secret);
  data.append("code", code);
  data.append("redirect_uri", config.redirect_uri);
  console.log("data", data);

  // Request to exchange code for an access token
  // Need to add code for refresh token - also enable on github first
  // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      console.log("afdsgd", paramsString);
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
      console.log("access_token", access_token);

      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      console.log("response", response);
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
