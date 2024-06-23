import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { BalanceInput } from "../types";
import { APP_DOMAIN } from "../utils/constants";

export default function useBalance() {
  const { data: balance, error } = useSWR<BalanceInput>(`${APP_DOMAIN}/api/user/balance`, fetcher, { refreshInterval: 30000 });

  return {
    balance: balance,
    loading: !balance && !error,
    error,
  };
}
