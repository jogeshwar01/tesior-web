import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { globalForPrisma } from "@repo/prisma";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        // profile.login contains the GitHub username
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "user",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(globalForPrisma.prismaWithoutClientExtensions),
  // need to add strategy to jwt else will get jwt from database (won't go inside jwt callback)
  // for adapters, default is database else default is jwt
  // need this to use getToken in nextjs middleware to get next auth jwt
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // need this for getting token in middleware (as now we're using jwt strategy)
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        id: token.id as string,
        // @ts-ignore
        role: token.role,
      };

      return session;
    },
  },
};
