<h1 align="center"> Tesior 💵</h1>

<p align="center">
    🤖 The open-source Web3 bounties platform.
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> .
    <a href="#tech-stack"><strong>Tech Stack</strong></a> .
    <a href="#contributing"><strong>Contributing</strong></a> .
    <a href="https://github.com/jogeshwar01/tesior-web/blob/main/DOCS.md" target="_blank"><strong>Docs</strong></a>
</p>

<p align="center">
  <a href="https://x.com/jogeshwar01">
    <img src="https://img.shields.io/twitter/follow/jogeshwar01?style=flat&label=%40jogeshwar01&logo=twitter&color=0bf&logoColor=000" alt="Twitter" />
  </a>
</p>

## Introduction

Tesior is an advanced open-source platform tailored for the Web3 ecosystem, enabling seamless bounty management and cryptocurrency transactions.

## Features

- With Tesior, project maintainers can efficiently reward contributors directly on GitHub using the `/bounty <amount>` comments, which facilitates immediate crypto transfers into their Tesior wallets.
- The platform supports comprehensive management of multiple projects for each account, allowing distinct user groups for each.
- Maintainers can add custom tasks and approve/pay for them on the dashboard itself.
- The Tesior dashboard offers a detailed overview of all transactions, both sent and received, ensuring transparency and control.
- Whether you are a contributor or a maintainer, Tesior provides the tools necessary to streamline your project operations.

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
