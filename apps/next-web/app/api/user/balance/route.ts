import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
      pending_amount: user?.pending_amount,
      locked_amount: user?.locked_amount,
    });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
