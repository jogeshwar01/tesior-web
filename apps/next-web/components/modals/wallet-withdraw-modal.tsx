import { useMediaQuery } from "@/lib/hooks";
import { Modal } from "@/components/shared";
import { Button } from "@/components/ui/new-york";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

function WalletWithdrawModal({
  showWalletWithdrawModal,
  setShowWalletWithdrawModal,
}: {
  showWalletWithdrawModal: boolean;
  setShowWalletWithdrawModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [withdrawing, setWithdrawing] = useState(false);
  const { isMobile } = useMediaQuery();
  const { publicKey } = useWallet();

  async function withdraw() {
    try {
      const response = await fetch(`/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const { message, error } = await response.json();

      if (response.status === 200) {
        toast.success("Withdrawal initiated!", {
          description: message,
        });
      } else {
        toast.error("Failed to send withdrawal", {
          description: error,
        });
      }
    } catch (error) {
      console.error("Failed to send withdrawal", error);
      toast.error("Failed to send withdrawal", {
        description: (error as any)?.message,
      });
    }
  }

  return (
    <Modal
      showModal={showWalletWithdrawModal}
      setShowModal={setShowWalletWithdrawModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <h2 className="text-2xl font-bold">Tesior</h2>
        <h3 className="text-lg font-medium">Withdraw from Wallet</h3>
        <p className="text-center text-sm text-gray-500">
          Withdraw funds from your wallet.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setWithdrawing(true);
          await withdraw();
          setWithdrawing(false);
          setShowWalletWithdrawModal(false);
        }}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="username" className="block text-sm text-gray-700">
            Public Key
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div
              className="block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm overflow-x-auto whitespace-nowrap"
              aria-disabled="true"
            >
              {publicKey?.toString() || "No Public Key Found"}
            </div>
          </div>
        </div>
        <Button disabled={withdrawing || !publicKey}>
          {withdrawing
            ? "Withdrawing"
            : !publicKey
              ? "Connect Wallet to Withdraw"
              : "Withdraw"}
        </Button>
      </form>
    </Modal>
  );
}

export function useWalletWithdrawModal() {
  const [showWalletWithdrawModal, setShowWalletWithdrawModal] = useState(false);

  const WalletWithdrawModalCallback = useCallback(() => {
    return (
      <WalletWithdrawModal
        showWalletWithdrawModal={showWalletWithdrawModal}
        setShowWalletWithdrawModal={setShowWalletWithdrawModal}
      />
    );
  }, [showWalletWithdrawModal, setShowWalletWithdrawModal]);

  return useMemo(
    () => ({
      setShowWalletWithdrawModal,
      WalletWithdrawModal: WalletWithdrawModalCallback,
    }),
    [setShowWalletWithdrawModal, WalletWithdrawModalCallback]
  );
}
