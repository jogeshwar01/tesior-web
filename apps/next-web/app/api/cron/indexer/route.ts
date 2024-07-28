import prisma from "@repo/prisma";
import { NextRequest, NextResponse } from "next/server";

const APP_WALLET_ADDRESS =
  process.env.APP_WALLET_ADDRESS ??
  "GaCqPZyUbEWHvUHq821qqDxG2YofznCrA5B6sW7MfZRs";

export async function GET(req: NextRequest) {
  if(req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Find 100 unprocessed entries in the indexer
  const indexerData = await prisma.indexer.findMany({
    where: {
      processed: false,
      flagged: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  });

  const setProcessedInIndexer = async (id: string, flagged?: boolean) => {
    await prisma.indexer.update({
      where: {
        id,
      },
      data: {
        processed: true,
        flagged: flagged ?? false,
      },
    });
  };

  for (const data of indexerData) {
    const block: any = data.transaction;

    // if no block found, mark as processed
    if (block.length === 0) {
      await setProcessedInIndexer(data.id);
      continue;
    }

    const transaction = block[0];
    const transactionSignature = transaction?.signature;
    const transactionType = transaction?.type;

    if (
      !transactionSignature ||
      !transactionType ||
      transactionType !== "TRANSFER"
    ) {
      // invalid transaction
      await setProcessedInIndexer(data.id);
      continue;
    }

    const nativeTransfers = transaction?.nativeTransfers;
    if (!nativeTransfers) {
      // invalid transaction
      await setProcessedInIndexer(data.id);
      continue;
    }

    for (const transfer of nativeTransfers) {
      const { amount, fromUserAccount, toUserAccount } = transfer;
      if (!amount || !fromUserAccount || !toUserAccount) {
        // invalid transfer
        await setProcessedInIndexer(data.id);
        continue;
      }

      if (fromUserAccount === APP_WALLET_ADDRESS) {
        // find user who owns that wallet from wallet table
        // then check if he has the >= amount locked - if yes, update his locked amount
        // then update the indexer data to processed: true

        const walletUser = await prisma.wallet.findFirst({
          where: {
            publicKey: toUserAccount,
          },
        });

        if (!walletUser) {
          // User with given wallet not found - need to flag it - why did we send this txn to this wallet?
          await setProcessedInIndexer(data.id, true);
          continue;
        }

        const user = await prisma.user.findFirst({
          where: {
            id: walletUser.user_id,
          },
        });

        if (!user) {
          // User not found
          await setProcessedInIndexer(data.id);
          continue;
        }

        // Update user locked amount, create payment entry and mark as processed
        if (user.locked_amount >= amount) {
          await prisma.$transaction([
            prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                locked_amount: {
                  decrement: BigInt(amount),
                },
              },
            }),
            prisma.payment.upsert({
              where: {
                signature: transactionSignature,
              },
              update: {
                user_id: user.id,
                amount: BigInt(amount),
                status: "Success",
              },
              create: {
                user_id: user.id,
                amount: BigInt(amount),
                signature: transactionSignature,
                status: "Success",
              },
            }),
            prisma.indexer.update({
              where: {
                id: data.id,
              },
              data: {
                processed: true,
              },
            }),
          ]);
        } else {
          // ideally user would never have less locked amount than the amount being transferred
          // but if it happens, mark as processed - might have already been updated in real time
          await setProcessedInIndexer(data.id);
        }
      } else if (toUserAccount === APP_WALLET_ADDRESS) {
        // check if user with that wallet exists, if yes, add to pending amount
        const walletUser = await prisma.wallet.findFirst({
          where: {
            publicKey: toUserAccount,
          },
        });

        if (!walletUser) {
          // User with given wallet not found - need to flag it - why did we receive this txn from this wallet?
          await setProcessedInIndexer(data.id, true);
          continue;
        }

        const user = await prisma.user.findFirst({
          where: {
            id: walletUser.user_id,
          },
        });

        if (!user) {
          // User not found
          await setProcessedInIndexer(data.id);
          continue;
        }

        // Update user pending amount, create escrow entry and mark as processed
        await prisma.$transaction([
          prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              pending_amount: {
                increment: BigInt(amount),
              },
            },
          }),
          prisma.escrow.upsert({
            where: {
              signature: transactionSignature,
            },
            update: {
              user_id: user.id,
              amount: BigInt(amount),
              status: "Success",
            },
            create: {
              user_id: user.id,
              amount: BigInt(amount),
              signature: transactionSignature,
              status: "Success",
            },
          }),
          prisma.indexer.update({
            where: {
              id: data.id,
            },
            data: {
              processed: true,
            },
          }),
        ]);
      } else {
        // mark as processed
        // cannot happen ideally - as we only send to APP_WALLET_ADDRESS or receive from APP_WALLET_ADDRESS
        await setProcessedInIndexer(data.id);
      }
    }
  }

  return NextResponse.json({ processed: true }, { status: 200 });
}
