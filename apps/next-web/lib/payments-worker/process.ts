import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
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

  let signature: string;
  try {
    if (!user || !publicKey) {
      throw new Error("User or Public Key Not Found");
    }
    if (!APP_WALLET_ADDRESS) {
      throw new Error("Set parent public key");
    }
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(APP_WALLET_ADDRESS),
        toPubkey: new PublicKey(publicKey),
        lamports: user.locked_amount,
      })
    );

    const keypair = recoverPrivateKey(await fetchShares());

    signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    // this should ideally happen before sending to blockchain
    await prisma.payment.create({
      data: {
        user_id: userId,
        amount: BigInt(user.locked_amount),
        status: TxnStatus.Processing, // processing as the CRON will update the status after settling user funds
        signature,
      },
    });
    console.log(
      `User ${userId} was payed, ${user.locked_amount} lamports, signature: ${signature}`
    );
  } catch (error) {
    console.log((error as Error).message);
    return;
  }

  // - NOT USED FOR NOW - balance part handled by indexer + cron
  // --------------------------------------------------
  // await prisma.$transaction(
  //   async (tx: any) => {
  //     await tx.user.update({
  //       where: { id: userId },
  //       data: { locked_amount: { decrement: user.locked_amount } },
  //     });

  //     await tx.payment.create({
  //       data: {
  //         user_id: userId,
  //         amount: user.locked_amount,
  //         status: TxnStatus.Success,
  //         signature: signature,
  //       },
  //     }),
  //       console.log(
  //         "User's locked amount and payout is cleared, Transaction Successful.\n"
  //       );
  //   },
  //   {
  //     maxWait: 5000, // default: 2000
  //     timeout: 15000, // default: 5000 - 15000 is the limit for prisma accelerate
  //     isolationLevel: "Serializable",
  //   }
  // );
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
    // signature is unique in the database to prevent same txn signature
    await prisma.escrow.create({
      data: {
        user_id: adminId,
        amount: BigInt(amountInLamports),
        signature,
        status: TxnStatus.Processing,
      },
    });

    // - NOT USED FOR NOW - balance part handled by indexer + cron
    // --------------------------------------------------------
    // // need to wait here to ensure the transaction is confirmed
    // await new Promise((resolve) => setTimeout(resolve, 30000));
    // const transaction = await connection.getTransaction(signature, {
    //   maxSupportedTransactionVersion: 1,
    // });

    // if (
    //   BigInt(
    //     (transaction?.meta?.postBalances[1] ?? 0) -
    //       (transaction?.meta?.preBalances[1] ?? 0)
    //   ) !== amountInLamports
    // ) {
    //   throw new Error("Transaction amount mismatch");
    // }

    // if (
    //   transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
    //   APP_WALLET_ADDRESS
    // ) {
    //   throw new Error("Transaction sent to wrong address");
    // }

    // const senderKey = transaction?.transaction.message
    //   .getAccountKeys()
    //   .get(0)
    //   ?.toString();

    // const isSenderValid = wallets.some(
    //   (wallet) => wallet.publicKey === senderKey
    // );
    // if (!isSenderValid) {
    //   throw new Error("Transaction sent from wrong address");
    // }

    // // check time also - a user can send the same signature again and again
    // // parse the signature here to ensure the person has paid 0.1 SOL - is it just a system transfer or something else
    // // const transaction = Transaction.from(parseData.data.signature);

    // await prisma.$transaction([
    //   prisma.escrow.update({
    //     where: {
    //       id: escrow.id,
    //     },
    //     data: {
    //       status: TxnStatus.Success,
    //     },
    //   }),
    //   prisma.user.update({
    //     where: {
    //       id: adminId,
    //     },
    //     data: {
    //       pending_amount: {
    //         increment: BigInt(amountInLamports),
    //       },
    //     },
    //   }),
    // ]);

    console.log(
      "Admin Escrow Transaction Initiated. It will be processed shortly"
    );
  } catch (error) {
    console.log((error as Error).message);
    return;
  }
};
