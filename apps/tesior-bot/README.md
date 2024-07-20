# Tesior Bot

> A Cloudflare Worker (Hono) + GitHub App built with @octokit/app
> `POST` requests: handle webhook request from GitHub

## Setup

Note that you require access to the new GitHub Actions for the automated deployment to work.

1. [Create a GitHub App](https://developer.github.com/apps/building-github-apps/creating-a-github-app/)
2. [Create a Cloudflare account](https://dash.cloudflare.com/) (it's free!) if you don't have one yet.
3. Install the `wrangler` CLI and login with your account

   ```
   npm install --global wrangler
   wrangler login
   ```

4. Add the following secrets to your Cloudflare worker:

   - `APP_ID`: In your GitHub App registration's settings page, find `App ID`

     ```
     wrangler secret put APP_ID
     ```

   - `WEBHOOK_SECRET`: In your GitHub App registration's settings page, find `Webhook secret`

     ```
     wrangler secret put WEBHOOK_SECRET
     ```

   - `PRIVATE_KEY`: Generate a private key (see the button at the bottom of your GitHub App registration's settings page).

     1. You will be prompted to download a `*.pem` file. After download, rename it to `private-key.pem`.
     2. Convert the key from the `PKCS#1` format to `PKCS#8` (The WebCrypto API only supports `PKCS#8`):

        ```
        openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.pem
        ```

     3. Write the contents of the new file into the secret `PRIVATE_KEY`:

        ```
        cat private-key-pkcs8.pem | wrangler secret put PRIVATE_KEY
        ```

   - Instead of using `wrangler secret put`, you can also add the variables in the wrangler.toml file under the `[vars]` section.

5. For local development - set the env variables in `.dev.vars` (check `.dev.vars.example` for required variables) and run the following command -

```
yarn dev
```

To setup bot for local development, you would need a webhook url for your github app to hit.
You can use ngrok to create a tunnel to your localhost. Suppose your bot runs on localhost:8787, then you can run:

```
ngrok http 8787
```

After executing that command you should see something like this:

    Forwarding      https://9add-49-43-98-101.ngrok-free.app -> http://localhost:8787

6. To deploy your code to Hono -

```
yarn deploy
```

7. Add the Webhook URL (ngrok for local dev. or cloudflare worker url) in the Github App.

## License

[ISC](LICENSE) © 2024 Jogeshwar Singh
