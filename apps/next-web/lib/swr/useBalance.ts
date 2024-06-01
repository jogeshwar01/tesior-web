import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { BalanceInput } from "../types";

export default function useBalance() {
  const { data: balance, error } = useSWR<BalanceInput>("/api/user/balance", fetcher);

  return {
    balance: balance,
    loading: !balance && !error,
    error,
  };
}
