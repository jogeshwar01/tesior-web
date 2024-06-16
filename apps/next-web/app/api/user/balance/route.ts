import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { lamportsToSol } from "@/lib/utils/solana";

// Get User balance
export async function GET() {
  try {
    const session = await getSession();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json({
      pending_amount: lamportsToSol(user?.pending_amount),
      locked_amount: lamportsToSol(user?.locked_amount),
    });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
