import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";
import { lamportsToSol, solToLamports } from "@/lib/utils/solana";
import { Redis } from "@/lib/payments-worker/redis";
import { checkRateLimit, getRateLimitReset } from "@/lib/rate-limit";

// Get all user escrows
export async function GET(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    if (!checkRateLimit(`escrow:GET:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(getRateLimitReset(`escrow:GET:${ip}`)),
          },
        },
      );
    }

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

// Create Escrow payment
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!checkRateLimit(`escrow:POST:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(getRateLimitReset(`escrow:POST:${ip}`)),
        },
      },
    );
  }

  const session = await getSession();
  const adminId = session.user.id;

  if (!adminId) {
    return new Response("Admin is required", { status: 400 });
  }

  // Per-user rate limit on escrow creation
  if (!checkRateLimit(`escrow:POST:user:${adminId}`, 5, 60_000)) {
    return NextResponse.json(
      {
        error:
          "Too many escrow creation requests. Please wait before trying again.",
      },
      { status: 429 },
    );
  }

  const body = await req.json();
  const { amount, signature } = body;

  if (!amount || !signature || !adminId) {
    return new Response("Invalid payload", { status: 411 });
  }

  try {
    await Redis.getInstance().send("admin_escrow", {
      data: {
        adminId,
        amount,
        signature,
      },
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
