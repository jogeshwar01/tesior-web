import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { getSession } from "@/lib/auth/session";

// verifies the signature and saves the public key to the database for the user
export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  const { publicKey, signature } = body;

  if (!publicKey || !signature) {
    return new Response("Invalid payload", { status: 411 });
  }

  const message = new TextEncoder().encode("Verify public key for tesior");
  const publicKeyBytes = new PublicKey(publicKey).toBytes();

  // frontend had sent signature as a uint8array, but as json doesnt natively support typed arrays like uint8array,
  // it was converted to an object. So, we need to convert it back to a uint8array. (can also send a base64 encoded string from frontend and decode here)
  // Phantom gives signature in { data : ... }  while backpack directly gives the uint8array
  const signatureUint8Array = new Uint8Array(
    signature.data ?? Object.keys(signature).map((key) => signature[key])
  );

  const result = nacl.sign.detached.verify(
    message,
    signatureUint8Array,
    publicKeyBytes
  );

  if (!result) {
    return new Response("Incorrect Signature", { status: 411 });
  }

  try {
    await prisma.wallet.create({
      data: {
        user_id: session.user.id,
        publicKey: publicKey,
      },
    });

    return NextResponse.json(
      { message: "Public key verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Check if the public key is already saved in the database for the user
export async function GET(req: NextRequest) {
  const session = await getSession();
  const searchParams = req.nextUrl.searchParams;
  const publicKey = searchParams.get("publicKey") ?? undefined;

  if (!publicKey) {
    return new Response("Invalid payload", { status: 411 });
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        publicKey: publicKey,
      },
    });

    if (!wallet) {
      return new Response("Public key not found", { status: 404 });
    }

    if(wallet.user_id !== session.user.id) {
      return new Response("Wallet already connected with another user", { status: 403 });
    }

    return NextResponse.json({ message: "Public key found" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
