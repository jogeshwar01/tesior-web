# Helius Webhooks To Index Solana Blockchain

Create your own webhook to tap into Solana events and send them to your applications, either parsed or in raw formats.

## Overview

- Create an ngrok account (https://ngrok.com/)
- Create an account on Helius (https://www.helius.dev) in order to push data to the webhook you'll create
- Create a simple hono app (cloudflare workers) with the default endpoint as the webhook.

## Step 1 - Setup an ngrok account

Because we'll be running our webhook locally (localhost:8787/), we need a way to tell Helius how to send a request to our localhost. There are several ways to do this, but the easiest is to use ngrok (https://ngrok.com/). Sign up is free. Once you do that, you can download ngrok to your machine (Windows, MacOS, Linux). Once that is installed you can check to see if it's working:

     ngrok -v

If that successfully prints the version you installed then you can run:

    ngrok http <port>

After executing that command you should see something like this:

    Forwarding      https://9add-49-43-98-101.ngrok-free.app -> http://localhost:<port>

This means, you can now use "https://9add-49-43-98-101.ngrok-free.app" and a public facing URL that will forward to your localhost. This URL is what we'll use to configure Helius.

## Step 2 - Setup

If you don't already have a Helius (https://www.helius.dev) account, you can create one for free. It will generate a project name for you and ask you to generate a new API key. Click the button and it will generate a new key and forward you to your new dashboard. You'll see two a devnet and mainnet URL that you can use for Solana RPC endpoints, but what we are interested in is the webhook functionality. Let's click on the webhook link in the navigation menu.

Click the "New Webhook" button.
Add the desired transaction types and wallet addresses that you need to index.
If you only want to track transfers - there is a TRANSFER type in the Enhanced Webhook Transactions.
Now we'll configure the webhook using the URL that ngrok provided: [https://3214-199-223-251-92.ngrok-free.app](https://3214-199-223-251-92.ngrok-free.app/)

## Step 3 - Webhook (Hono - Cloudflare Workers)

Create a basic cloudflare worker with hono following this guide - [Getting Started - Hono](https://hono.dev/docs/getting-started/cloudflare-workers)

```
yarn create hono my-app
cd my-app
yarn
```

Add the relevant code to parse the blockchain data as per your usecase.
Here we have used the common PrismaClient from `packages/prisma` and are inserting the transaction data into our `Indexer` table in the database.

For local development - set the env variables in `.dev.vars` (check `.dev.vars.example` for required variables)

```
yarn dev
```

For cloudflare workers deployment - add the env variables in the `wrangler.toml` file under the `[vars]` section. To deploy -

```
yarn deploy
```

Note: **Make sure to not add the / at the end of the webhook url.**

Update the webhook url in helius with your cloudflare worker url. You can now start requesting data from Helius for your use cases.
