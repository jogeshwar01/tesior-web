import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { encode as bs58Encode } from "bs58";
import prisma from "@repo/prisma";

import { fetchShares, recoverPrivateKey } from "@/lib/shamirs-secret-sharing";
import { TxnStatus } from "@/lib/types";
import { solToLamports } from "@/lib/utils/solana";

const connection = new Connection(process.env.RPC_URL ?? "");
const APP_WALLET_ADDRESS = process.env.APP_WALLET_ADDRESS;

export const processUserPaymentQueue = async (job: {
  data: { userId: string; publicKey: string };
}) => {
  const { userId, publicKey } = job.data as {
    userId: string;
    publicKey: string;
  };
  console.log("\nInitializing Payout Transaction");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !publicKey) {
    console.log("User or Public Key Not Found");
    return;
  }
  if (!APP_WALLET_ADDRESS) {
    console.log("Set parent public key");
    return;
  }

  // Build and sign the transaction so we have the signature before any network call.
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(APP_WALLET_ADDRESS),
  }).add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(APP_WALLET_ADDRESS),
      toPubkey: new PublicKey(publicKey),
      lamports: user.locked_amount,
    }),
  );

  const keypair = recoverPrivateKey(await fetchShares());
  transaction.sign(keypair);

  // The signature is now deterministically available from the signed transaction.
  const signatureBytes = transaction.signature;
  if (!signatureBytes) {
    console.log("Failed to sign transaction — no signature produced");
    return;
  }
  const signature = bs58Encode(signatureBytes);

  // --- Store in DB with Processing status BEFORE hitting the network ---
  let paymentId: string;
  try {
    const payment = await prisma.payment.create({
      data: {
        user_id: userId,
        amount: BigInt(user.locked_amount),
        status: TxnStatus.Processing,
        signature,
      },
    });
    paymentId = payment.id;
    console.log(`Payment record created (Processing): ${paymentId}, sig: ${signature}`);
  } catch (dbError) {
    console.log(
      "Failed to persist payment record before blockchain submission:",
      (dbError as Error).message,
    );
    return;
  }

  // --- Send to blockchain and confirm ---
  try {
    await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed",
    );

    console.log(
      `User ${userId} was paid, ${user.locked_amount} lamports, signature: ${signature}`,
    );

    // Update status to Success after on-chain confirmation.
    // The indexer/cron also upserts this record — the upsert in cron/indexer
    // will win if it runs concurrently, but both write Success so there's no conflict.
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: TxnStatus.Success },
    });
    console.log(`Payment record updated to Success: ${paymentId}`);
  } catch (error) {
    console.log("Blockchain submission or confirmation failed:", (error as Error).message);

    // Mark the DB record as Failed so operators can identify stuck payments.
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: TxnStatus.Failure },
    });
    console.log(`Payment record updated to Failure: ${paymentId}`);
  }
};

export const processAdminEscrowQueue = async (job: {
  data: { adminId: string; amount: number; signature: string };
}) => {
  const { adminId, amount, signature } = job.data;
  const amountInLamports = solToLamports(amount);
  console.log("\nInitializing Admin Escrow Transaction");

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
  });

  const wallets = await prisma.wallet.findMany({
    where: {
      user_id: adminId,
    },
  });

  if (!admin || !wallets) {
    throw new Error("Admin or Public Key Not Found");
  }

  try {
    // Signature comes from the client-side Solana wallet — the transaction is
    // already on-chain by the time this worker runs. Store it immediately with
    // Processing status so the record exists before any confirmation check.
    await prisma.escrow.create({
      data: {
        user_id: adminId,
        amount: BigInt(amountInLamports),
        signature,
        status: TxnStatus.Processing,
      },
    });

    console.log(
      "Admin Escrow Transaction Initiated. It will be processed shortly"
    );
  } catch (error) {
    console.log((error as Error).message);
    return;
  }
};
