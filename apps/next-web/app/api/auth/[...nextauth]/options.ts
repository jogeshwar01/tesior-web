import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        return {
          ...profile,
          role: "user",
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // need to add strategy to jwt else will get jwt from database (won't go inside jwt callback)
  // for adapters, default is database else default is jwt
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    session: async ({ session, user }) => {
      session.user = {
        ...session.user,
        id: user.id,
        // @ts-ignore
        role: user.role,
      };

      return session;
    },
  },
};
