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
import { Input } from "../ui/new-york/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { TOTAL_DECIMALS } from "@/lib/utils/constants";

const APP_WALLET_ADDRESS =
  process.env.APP_WALLET_ADDRESS ??
  "GaCqPZyUbEWHvUHq821qqDxG2YofznCrA5B6sW7MfZRs";

function WalletDepositModal({
  showWalletDepositModal,
  setShowWalletDepositModal,
}: {
  showWalletDepositModal: boolean;
  setShowWalletDepositModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [depositing, setDepositing] = useState(false);
  const [amount, setAmount] = useState<number>(0.1);
  const { isMobile } = useMediaQuery();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  async function deposit() {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey(APP_WALLET_ADDRESS),
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

      const response = await fetch(`/api/escrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, signature }),
      });

      const { message, error } = await response.json();

      if (response.status === 200) {
        // mutate(`/api/balance`);  // no need to do this as useBalance SWR refreshes every 30 seconds
        toast.success("Escrow creation initiated!", {
          description: message,
        });
      } else {
        toast.error("Failed to send escrow", {
          description: error,
        });
      }
    } catch (error) {
      console.error("Failed to send escrow.", (error as any)?.message ?? error);
      toast.error(
        "Failed to send escrow. Don't worry, your funds are safe. They will be processed shortly in case of deductions.",
        {
          description: (error as any)?.message,
        }
      );
    }
  }

  return (
    <Modal
      showModal={showWalletDepositModal}
      setShowModal={setShowWalletDepositModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <h2 className="text-2xl font-bold">Tesior</h2>
        <h3 className="text-lg font-medium">Deposit to Wallet</h3>
        <p className="text-center text-sm text-gray-500">
          Deposit funds to your wallet.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setDepositing(true);
          await deposit();
          setDepositing(false);
          setShowWalletDepositModal(false);
        }}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="username" className="block text-sm text-gray-700">
            Enter Amount (in SOL)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              name="amount"
              id="amount"
              autoFocus={!isMobile}
              autoComplete="off"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <Button disabled={depositing || !publicKey}>
          {depositing
            ? "Depositing"
            : !publicKey
              ? "Connect Wallet to Deposit"
              : "Deposit"}
        </Button>
      </form>
    </Modal>
  );
}

export function useWalletDepositModal() {
  const [showWalletDepositModal, setShowWalletDepositModal] = useState(false);

  const WalletDepositModalCallback = useCallback(() => {
    return (
      <WalletDepositModal
        showWalletDepositModal={showWalletDepositModal}
        setShowWalletDepositModal={setShowWalletDepositModal}
      />
    );
  }, [showWalletDepositModal, setShowWalletDepositModal]);

  return useMemo(
    () => ({
      setShowWalletDepositModal,
      WalletDepositModal: WalletDepositModalCallback,
    }),
    [setShowWalletDepositModal, WalletDepositModalCallback]
  );
}
