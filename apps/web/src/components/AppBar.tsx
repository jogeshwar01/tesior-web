import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../../config.ts";
import axios from "axios";

export const AppBar = () => {
  const { publicKey, signMessage } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  const getBalance = useCallback(async () => {
    if (!publicKey) {
      return;
    }

    const response = await axios.get(`${BACKEND_URL}/v1/user/balance`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    setBalance(response.data.pending_amount);
  }, [publicKey]);

  const signAndSend = useCallback(async () => {
    if (!publicKey) {
      return;
    }

    const message = new TextEncoder().encode("Sign in to tesior as user");
    const signature = await signMessage?.(message);
    const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
      signature,
      publicKey: publicKey?.toString(),
    });

    if (!response.data.token) {
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", response.data.token);
    getBalance();
  }, [getBalance, publicKey, signMessage]);

  const handlePayout = useCallback(async () => {
    await axios.post(
      `${BACKEND_URL}/v1/user/payout`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    signAndSend();
  }, [publicKey, signAndSend]);

  return (
    <div className="flex justify-between border-b pb-2 pt-2">
      <div className="text-2xl pl-4 flex justify-center pt-4">
        Tesior - User
      </div>
      <div className="text-xl pr-4 pb-2 pt-2">Balance : {balance}</div>

      <div className="text-xl pr-4 pb-2 pt-2">
        <button
          onClick={async () => {
            handlePayout();
          }}
        >
          Withdraw
        </button>
      </div>
      <div className="text-xl pr-4 pb-2 pt-2">
        <WalletMultiButton />
      </div>
    </div>
  );
};
