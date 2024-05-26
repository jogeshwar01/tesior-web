import { Dispatch, SetStateAction } from "react";
import { BACKEND_URL } from "../../config.ts";
import axios from "axios";

export const WithdrawBalance = ({
  setBalance,
}: {
  setBalance: Dispatch<SetStateAction<number>>;
}) => {

  async function makeWithdraw() {
    const response = await axios.post(
      `${BACKEND_URL}/v1/admin/payout`,
      {},
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
      <button onClick={makeWithdraw}>Withdraw</button>
    </div>
  );
};
