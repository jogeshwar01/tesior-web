import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all user payments
export async function GET() {
  try {
    const session = await getSession();

    const payments = await prisma.payment.findMany({
      where: {
        user_id: session.user.id,
      },
    });

    return NextResponse.json(payments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
