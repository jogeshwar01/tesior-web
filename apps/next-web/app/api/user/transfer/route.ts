import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all user transfers
export async function GET() {
  try {
    const session = await getSession();

    const transfers = await prisma.transfer.findMany({
      where: {
        receiver_id: session.user.id,
      },
    });

    return NextResponse.json(transfers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
