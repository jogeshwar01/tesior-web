import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";

export const getSession = async () => {
  return getServerSession(authOptions) as Promise<Session>;
};
