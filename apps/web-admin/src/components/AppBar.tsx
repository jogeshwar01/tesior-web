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

    const response = await axios.get(`${BACKEND_URL}/v1/admin/balance`, {
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

    const message = new TextEncoder().encode("Sign in to tesior as admin");
    const signature = await signMessage?.(message);
    const response = await axios.post(`${BACKEND_URL}/v1/admin/signin`, {
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

  useEffect(() => {
    signAndSend();
  }, [publicKey, signAndSend]);

  return (
    <div className="flex justify-between border-b pb-2 pt-2">
      <div className="text-2xl pl-4 flex justify-center pt-4">
        Tesior - Admin
      </div>
      <div className="text-xl pr-4 pb-2 pt-2">Balance : {balance}</div>
      <div className="text-xl pr-4 pb-2 pt-2">
        <WalletMultiButton />
      </div>
    </div>
  );
};
