"use client";

import Card from "@/components/home/card";
import { Solana } from "@/components/shared/icons";
import useBalance from "@/lib/swr/useBalance";

export default function Wallet() {
  const { balance, error, loading } = useBalance();

  if (error) return <div>Failed to load wallet</div>;
  if (loading) return <div>Loading...</div>;

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
            <button className="mr-10">Withdraw</button>
            <button>Deposit</button>
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
