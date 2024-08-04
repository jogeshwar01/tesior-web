import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@repo/prisma";
import { lamportsToSol } from "@/lib/utils/solana";

// GET /api/user – get a specific user
export const GET = async () => {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const newUser = {
    ...user,
    pending_amount: lamportsToSol(user?.pending_amount),
    locked_amount: lamportsToSol(user?.locked_amount),
  };

  return NextResponse.json({
    ...newUser,
  });
};
