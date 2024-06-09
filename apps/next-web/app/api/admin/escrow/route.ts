import { getSession } from "@/lib/auth/session";
import { adminEscrowQueue } from "@/lib/redis/queues";
import { NextRequest, NextResponse } from "next/server";

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
    await adminEscrowQueue.add("process-queue", { adminId, amount, signature });

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
