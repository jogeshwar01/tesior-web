"use client";

import Card from "@/components/home/card";
import { Solana } from "@/components/shared/icons";
import useBalance from "@/lib/swr/useBalance";
import { useSession } from "next-auth/react";
import { usePublicKey } from "@/lib/hooks/use-public-key";
import { useWalletDepositModal } from "@/components/modals/wallet-deposit-modal";
import { useWalletWithdrawModal } from "@/components/modals/wallet-withdraw-modal";

export default function Wallet() {
  const session = useSession();
  const { balance, error, loading } = useBalance();

  const { WalletMultiButtonDynamic } = usePublicKey();
  const { setShowWalletDepositModal, WalletDepositModal } =
    useWalletDepositModal();

  const { setShowWalletWithdrawModal, WalletWithdrawModal } =
    useWalletWithdrawModal();

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
          <div className="flex justify-center">
            <button onClick={() => setShowWalletWithdrawModal(true)}>
              Withdraw
            </button>
            <button
              className="ml-10"
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
          <div className="absolute top-20 lg:block lg:right-40 sm:top-32 lg:top-44">
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
