import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "../../config.ts";

export const AddBalance = ({
  setBalance,
}: {
  setBalance: Dispatch<SetStateAction<number>>;
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState<number>(0);

  async function makePayment() {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
        lamports: amount * 1000000000,
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

    const response = await axios.post(
      `${BACKEND_URL}/v1/admin/escrow`,
      {
        amount: amount,
        signature: signature,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    setBalance(response.data.pending_amount);
  }

  return (
    <div className="mt-1">
      <h1>Add Balance</h1>
      <div>
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={makePayment}>Add</button>
      </div>
    </div>
  );
};
