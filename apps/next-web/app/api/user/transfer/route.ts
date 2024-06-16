import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
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

    const transfers: any = [];
    if(sentOrReceived === "sent") {
      const transfers = await prisma.transfer.findMany({
        where: {
          sender_id: session.user.id,
        },
      });

      return NextResponse.json(transfers, { status: 200 });
    }
    else if(sentOrReceived === "received") {
      const transfers = await prisma.transfer.findMany({
        where: {
          receiver_id: session.user.id,
        },
      });

      return NextResponse.json(transfers, { status: 200 });
    }

    return NextResponse.json(transfers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
