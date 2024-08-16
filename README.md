<h1 align="center"> Tesior 💵</h1>

<p align="center">
    🤖 The open-source Web3 bounties platform. Built with Solana.
    <br />
    <a href="https://tesior-web.vercel.app"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> .
    <a href="#tech-stack"><strong>Tech Stack</strong></a> .
    <a href="#architecture"><strong>Architecture</strong></a> .
    <a href="#contributing"><strong>Contributing</strong></a> .
    <a href="https://github.com/jogeshwar01/tesior-web/blob/main/DOCS.md"><strong>Docs</strong></a>
</p>

<p align="center">
  <a href="https://x.com/jogeshwar01">
    <img src="https://img.shields.io/twitter/follow/jogeshwar01?style=flat&label=%40jogeshwar01&logo=twitter&color=0bf&logoColor=000" alt="Twitter" />
  </a>

  <a href="https://x.com/jogeshwar01/status/1823985414111367367">
    <img src="https://img.shields.io/twitter/follow/jogeshwar01?style=flat&label=%40tesior&logo=twitter&color=0af&logoColor=000" alt="Twitter" />
  </a>
</p>

## Introduction

Tesior is an advanced open-source platform tailored for the Web3 (Solana) ecosystem, enabling seamless bounty management and cryptocurrency transactions.

## Features

- **Automated GitHub Integration for Bounties:** Instantly reward contributors with crypto (solana) with Tesior Bot via GitHub comments using `/bounty <amount>`.
- **Enhanced Security Measures:** Utilize multi-cloud Kubernetes clusters and Shamir’s Secret Sharing for robust private key management.
- **Blockchain Indexing via Helius:** Efficiently index blockchain data using Helius to not miss any transaction to/from tesior wallet.
- **Workspace Creation and Management:** Create and manage workspaces linked to GitHub repositories for centralized project control.
- **Multi-Project Management:** Manage multiple projects each with distinct user groups from a single account.
- **Dashboard Task Management:** Add, approve, and pay for custom tasks directly through the Tesior dashboard.
- **Transaction Transparency:** Access detailed transaction logs for both incoming and outgoing funds.
- **Wallet and Payments:** Manage Solana funds and track all wallet transactions through the Tesior interface.
- **Contributor Recognition with Leaderboard:** Feature and motivate contributors using a leaderboard based on task completion and bounties.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Upstash](https://upstash.com/) – redis
- [Neon](https://neon.tech/) - database
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) – auth
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js) - payments
- [Turborepo](https://turbo.build/repo) – monorepo
- [Helius](https://dev.helius.xyz/) - indexer webhook
- [Kubernetes](https://github.com/jogeshwar01/tesior-pkm) - private key management
- [Cloudflare Workers](https://hono.dev/docs/getting-started/cloudflare-workers) – github bot and helius webhook
- [Vercel](https://vercel.com/) – deployments

#### Others

- [Shadcn/ui](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Dub.co](https://github.com/dubinc/dub)
- [Precedent](https://github.com/steven-tey/precedent)
- [Radix UI](https://www.radix-ui.com/)
- [Tanstack](https://tanstack.com/)
- [Zod](https://zod.dev/)
- [SWR](https://swr.vercel.app/)
- [Sonner](https://sonner.emilkowal.ski/)
- [Ideogram AI](https://ideogram.ai/)
- [Tesior Bot](https://github.com/apps/tesior-bot)
- [Shamir Secret Sharing](https://github.com/jogeshwar01/tesior-pkm)

## Architecture

![Tesior Architecture](/apps/next-web/public/architecture.png)

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/jogeshwar01/tesior-web/issues) if you believe you've encountered a bug.
- Follow the [local development setup guide](#local-development-setup) below to get your local dev environment set up.
- Make a [pull request](https://github.com/jogeshwar01/tesior-web/pull) to add new features/make quality-of-life improvements/fix bugs.

## Local Development

A guide on how to run Tesior's codebase locally

1. Clone the repo into a public GitHub repository (or fork https://github.com/jogeshwar01/tesior-web).

   ```sh
   git clone https://github.com/jogeshwar01/tesior-web.git
   ```

2. Go to the project folder.

   ```sh
   cd tesior-web
   ```

3. Install packages with yarn.

   ```sh
   yarn install
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`.
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Add the `APP_WALLET_ADDRESS` - public key to receive payments.
   - Setup Github app to configure NextAuth. Add the respective `GITHUB_CLIENT_ID` AND `GITHUB_CLIENT_SECRET`.

   - For developing locally, start postgres and redis locally.

     ```sh
     cd docker
     docker compose up
     ```

   - For cloud deployments, setup database on Neon and redis on Upstash.

5. Private key management -

   - To send payments, you would need the private key of your wallet. This can be secured using multi-cloud kubernetes clusters and shamir secret sharing. This has been implemented here - [Tesior-pkm](https://github.com/jogeshwar01/tesior-pkm).

   - To test locally, go through the `shamir-secret-sharing` module [here](https://github.com/jogeshwar01/tesior-web/tree/main/apps/next-web/lib/shamirs-secret-sharing). Create 5 shares using the [createShares](https://github.com/jogeshwar01/tesior-web/blob/main/apps/next-web/lib/shamirs-secret-sharing/createShares.ts) function. Update [fetchShares](https://github.com/jogeshwar01/tesior-web/blob/main/apps/next-web/lib/shamirs-secret-sharing/recoverPrivateKey.ts) to get shares from `.env` instead of api calls to multi-cloud servers.

6. Build and Start the Nextjs app.

   ```sh
   yarn build
   yarn dev
   ```

## License

Tesior is open-source under the MIT License. You can [find it here](https://github.com/jogeshwar01/tesior-web/blob/main/LICENSE.md).
