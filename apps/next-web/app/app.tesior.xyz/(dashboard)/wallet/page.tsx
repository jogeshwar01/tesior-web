"use client";

import Card from "@/components/home/card";
import { Solana } from "@/components/shared/icons";
import useBalance from "@/lib/swr/useBalance";
import { useSession } from "next-auth/react";
import { usePublicKey } from "@/lib/hooks/use-public-key";
import { useWalletDepositModal } from "@/components/modals/wallet-deposit-modal";
import { useWalletWithdrawModal } from "@/components/modals/wallet-withdraw-modal";
import { LoadingSpinner } from "@/components/custom/loading";

export default function Wallet() {
  const session = useSession();
  const { balance, error, loading } = useBalance();

  const { WalletMultiButtonDynamic } = usePublicKey();
  const { setShowWalletDepositModal, WalletDepositModal } =
    useWalletDepositModal();

  const { setShowWalletWithdrawModal, WalletWithdrawModal } =
    useWalletWithdrawModal();

  if (error) return <div>Failed to load wallet</div>;
  if (loading) return <LoadingSpinner />;

  const features = [
    {
      title: "Tesior Wallet",
      description:
        "Withdraw or deposit solana from your wallet. You can also view your transaction history.",
      demo: (
        <div className="flex flex-col ">
          <div className="flex my-10 justify-center items-center align-middle">
            <div><Solana /></div>
            <div className="mx-5 text-2xl">{balance?.pending_amount || 0} SOL</div>
          </div>
          <div className="flex justify-center">
            <button
              className="border border-accent-3 p-2 rounded-md hover:bg-black"
              onClick={() => setShowWalletWithdrawModal(true)}
            >
              Withdraw
            </button>
            <button
              className="ml-10 border border-accent-3 p-2 rounded-md hover:bg-black"
              onClick={() => setShowWalletDepositModal(true)}
            >
              Deposit
            </button>
          </div>
        </div>
      ),
      large: false,
    },
  ];

  return (
    <>
      <WalletDepositModal />
      <WalletWithdrawModal />
      <div className="flex my-16 justify-center h-screen">
        {session && (
          <div className="absolute lg:right-40 sm:top-20 lg:top-32">
            <WalletMultiButtonDynamic />
          </div>
        )}

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
    </>
  );
}
