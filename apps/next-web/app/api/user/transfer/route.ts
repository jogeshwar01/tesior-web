import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { lamportsToSol } from "@/lib/utils/solana";
import { NextRequest, NextResponse } from "next/server";

// Get all user transfers - sent or received based on searchParam
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sentOrReceived = searchParams.get("transfer") ?? undefined;
    const session = await getSession();

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    let transfers: any = [];
    if (sentOrReceived === "sent") {
      transfers = await prisma.transfer.findMany({
        where: {
          sender_id: session.user.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } else if (sentOrReceived === "received") {
      transfers = await prisma.transfer.findMany({
        where: {
          receiver_id: session.user.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    }

    const newTransfers = transfers.map((transfer: any) => {
      return {
        ...transfer,
        amount: lamportsToSol(transfer.amount),
      };
    });

    return NextResponse.json(newTransfers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
