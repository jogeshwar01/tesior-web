import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { PrismaClient } from "@prisma/client";

import { PARENT_WALLET_ADDRESS } from "../config";
import { RPC_URL } from "../config";
import { fetchShares, recoverPrivateKey } from "../shamirs-secret-sharing";
import { EntityType, TxnStatus } from "@repo/common";

const prismaClient = new PrismaClient();
const connection = new Connection(RPC_URL);

export const processUserQueue = async (job: {
  data: { userId: string };
  name: string;
}) => {
  const { userId } = job.data as {
    userId: string;
  };

  console.log("\nInitializing Transaction");

  await prismaClient.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    let signature: string;
    try {
      if (!user) {
        throw new Error("User Not Found");
      }
      if (!PARENT_WALLET_ADDRESS) {
        throw new Error("Set parent public key");
      }
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
          toPubkey: new PublicKey(user.address),
          lamports: user.locked_amount,
        })
      );

      const keypair = recoverPrivateKey(await fetchShares());

      signature = await sendAndConfirmTransaction(connection, transaction, [
        keypair,
      ]);
      console.log(
        `User ${userId} was payed, ${user.locked_amount} lamports, signature: ${signature}`
      );
    } catch (error) {
      console.log((error as Error).message);
      return;
    }
    await tx.user.update({
      where: { id: userId },
      data: { locked_amount: { decrement: user.locked_amount } },
    });

    await tx.payment.create({
      data: {
        user_id: userId,
        amount: user.locked_amount,
        status: TxnStatus.Success,
        signature: signature,
        entity: EntityType.User,
      },
    }),
      console.log(
        "User's locked amount and payout is cleared, Transaction Successful.\n\n"
      );
  });
};

export const processAdminPayoutQueue = async (job: {
  data: { adminId: string };
  name: string;
}) => {
  const { adminId } = job.data as {
    adminId: string;
  };

  console.log("\nInitializing Transaction");

  await prismaClient.$transaction(async (tx) => {
    const admin = await tx.admin.findUnique({
      where: { id: adminId },
    });

    let signature: string;
    try {
      if (!admin) {
        throw new Error("Admin Not Found");
      }

      if (!PARENT_WALLET_ADDRESS) {
        throw new Error("Set parent public key");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
          toPubkey: new PublicKey(admin.address),
          lamports: admin.locked_amount,
        })
      );

      const keypair = recoverPrivateKey(await fetchShares());

      signature = await sendAndConfirmTransaction(connection, transaction, [
        keypair,
      ]);
      console.log(
        `Admin ${adminId} was payed, ${admin.locked_amount} lamports, signature: ${signature}`
      );
    } catch (error) {
      console.log((error as Error).message);
      return;
    }

    await tx.admin.update({
      where: { id: adminId },
      data: { locked_amount: { decrement: admin.locked_amount } },
    });

    await tx.payment.create({
      data: {
        admin_id: adminId,
        amount: admin.locked_amount,
        status: TxnStatus.Success,
        signature: signature,
        entity: EntityType.Admin,
      },
    }),
      console.log(
        "Admin's locked amount and payout is cleared, Transaction Successful.\n\n"
      );
  });
};

export const processAdminEscrowQueue = async (job: {
  data: { adminId: string; amount: number; signature: string };
  name: string;
}) => {
  const { adminId, amount, signature } = job.data;

  const admin = await prismaClient.admin.findUnique({
    where: {
      id: adminId,
    },
  });
  try {
    // signature is unique in the database to prevent same txn signature
    const escrow = await prismaClient.escrow.create({
      data: {
        admin_id: adminId,
        amount: Number(amount),
        signature,
        status: TxnStatus.Processing,
      },
    });

    // need to wait here to ensure the transaction is confirmed
    await new Promise((resolve) => setTimeout(resolve, 30000));
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 1,
    });

    if (
      (transaction?.meta?.postBalances[1] ?? 0) -
        (transaction?.meta?.preBalances[1] ?? 0) !==
      amount
    ) {
      throw new Error("Transaction amount mismatch");
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
      PARENT_WALLET_ADDRESS
    ) {
      throw new Error("Transaction sent to wrong address");
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
      admin?.address
    ) {
      throw new Error("Transaction sent from wrong address");
    }

    // check time also - a user can send the same signature again and again
    // parse the signature here to ensure the person has paid 0.1 SOL - is it just a system transfer or something else
    // const transaction = Transaction.from(parseData.data.signature);

    await prismaClient.$transaction([
      prismaClient.escrow.update({
        where: {
          id: escrow.id,
        },
        data: {
          status: TxnStatus.Success,
        },
      }),
      prismaClient.admin.update({
        where: {
          id: adminId,
        },
        data: {
          pending_amount: {
            increment: Number(amount),
          },
        },
      }),
    ]);
  } catch (error) {
    console.log((error as Error).message);
    return;
  }
};
