<h3 align="center">Tesior</h3>

<p align="center">
    The open-source Web3 bounties platform.
    <br />
    <a href="https://dub.co"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a>
</p>

<p align="center">
  <a href="https://twitter.com/jogeshwar01">
    <img src="https://img.shields.io/twitter/follow/jogeshwar01?style=flat&label=%40jogeshwar01&logo=twitter&color=0bf&logoColor=000" alt="Twitter" />
  </a>
</p>

## Introduction

Tesior is an open-source web3 bounty platform that streamlines financial transactions between contributors and maintainers across various projects. Whether for software, content, or any collaborative effort, Tesior ensures efficient and transparent fund management, enhancing the workflow for all participants.

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
- [Vercel](https://vercel.com/) – deployments

#### Others

- [Shadcn/ui](https://ui.shadcn.com/)
- [Precedent](https://github.com/steven-tey/precedent)
- [Radix UI](https://www.radix-ui.com/)
- [Tanstack](https://tanstack.com/)
- [Bullmq](https://docs.bullmq.io/)
- [Zod](https://zod.dev/)
- [SWR](https://swr.vercel.app/)
- [Sonner](https://sonner.emilkowal.ski/)

## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/jogeshwar01/tesior-web/fork).

   ```sh
   git clone https://github.com/jogeshwar01/tesior-web.git
   ```

2. Go to the project folder

   ```sh
   cd tesior-web
   ```

3. Install packages with yarn

   ```sh
   yarn install
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Setup Github app to configure NextAuth. Add the respective `GITHUB_CLIENT_ID` AND `GITHUB_CLIENT_SECRET`
   - For developing locally, start postgres and redis locally

   ```sh
   cd docker
   docker compose up
   ```

5. Build and Start the Nextjs app

   ```sh
   yarn build
   yarn dev
   ```
