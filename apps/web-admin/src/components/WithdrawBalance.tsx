import { Dispatch, SetStateAction, useCallback } from "react";
import { BACKEND_URL } from "../../config.ts";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";

export const WithdrawBalance = ({
  setBalance,
}: {
  setBalance: Dispatch<SetStateAction<number>>;
}) => {
  const publicKey = useWallet();

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
  }, [publicKey, setBalance]);

  async function makeWithdraw() {
    await axios.post(
      `${BACKEND_URL}/v1/admin/payout`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    getBalance();
  }

  return (
    <div className="mt-1">
      <button onClick={makeWithdraw}>Withdraw</button>
    </div>
  );
};
