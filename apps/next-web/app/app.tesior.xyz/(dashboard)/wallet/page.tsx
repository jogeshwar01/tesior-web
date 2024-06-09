"use client";

import Card from "@/components/home/card";
import { Solana } from "@/components/shared/icons";
import useBalance from "@/lib/swr/useBalance";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { useState } from "react";

const PARENT_WALLET_ADDRESS =
  process.env.PARENT_WALLET_ADDRESS ??
  "GaCqPZyUbEWHvUHq821qqDxG2YofznCrA5B6sW7MfZRs";
const TOTAL_DECIMALS = parseInt(process.env.TOTAL_DECIMALS ?? '1000000000');

export default function Wallet() {
  const { balance, error, loading } = useBalance();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState<number>(0.05);

  if (error) return <div>Failed to load wallet</div>;
  if (loading) return <div>Loading...</div>;

  async function deposit() {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
          lamports: amount * TOTAL_DECIMALS,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      const response = await fetch(`/api/admin/escrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * TOTAL_DECIMALS, signature }),
      });

      if (response.status === 200) {
        // mutate("/api/user/balance");  // no need to do this as useBalance SWR refreshes every 30 seconds
        toast.success("Escrow creation initiated!");
      } else {
        toast.error("Failed to send escrow");
      }
    } catch (error) {
      console.error("Failed to send escrow", error);
      toast.error("Failed to send escrow");
    }
  }

  async function withdraw() {
    try {
      const response = await fetch(`/api/user/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Withdrawal initiated!");
      } else {
        toast.error("Failed to send withdrawal");
      }
    } catch (error) {
      console.error("Failed to send withdrawal", error);
      toast.error("Failed to send withdrawal");
    }
  }

  const features = [
    {
      title: "Tesior Wallet",
      description:
        "Withdraw or deposit solana from your wallet. You can also view your transaction history.",
      demo: (
        <div className="flex flex-col ">
          <div className="flex my-10 justify-center align-middle">
            <Solana />
            <div className="mx-5 text-2xl">{balance?.pending_amount || 0}</div>
          </div>
          <div className="flex">
            <button className="mr-10" onClick={withdraw}>Withdraw</button>
            <button onClick={deposit}>Deposit</button>
          </div>
        </div>
      ),
      large: false,
    },
  ];

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-fade-up">
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={demo}
            large={large}
          />
        ))}
      </div>
    </div>
  );
}
