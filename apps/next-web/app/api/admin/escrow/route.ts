import { getSession } from "@/lib/auth/session";
import { adminEscrowQueue } from "@/lib/redis/queues";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { lamportsToSol, solToLamports } from "@/lib/utils/solana";

// Get all user escrows
export async function GET() {
  try {
    const session = await getSession();

    const escrows = await prisma.escrow.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    const newEscrows = escrows.map((escrow) => {
      return {
        ...escrow,
        amount: lamportsToSol(escrow.amount),
      };
    });

    return NextResponse.json(newEscrows, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Create Escrow payment by admin
export async function POST(req: NextRequest) {
  const session = await getSession();
  const adminId = session.user.id;

  if (!adminId) {
    return new Response("Admin is required", { status: 400 });
  }

  const body = await req.json();
  const { amount, signature } = body;

  if (!amount || !signature || !adminId) {
    return new Response("Invalid payload", { status: 411 });
  }

  try {
    await adminEscrowQueue.add("process-queue", {
      adminId,
      amount,
      signature,
    });

    return NextResponse.json(
      { message: "Escrow creation initiated. It will be processed shortly" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "An error occurred while creating escrow: " + error.message,
      },
      { status: 500 }
    );
  }
}
