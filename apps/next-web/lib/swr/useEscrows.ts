import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { PaymentInput } from "../types";
import { APP_DOMAIN } from "../utils/constants";

export default function useEscrows() {
  const { data: escrows, error } = useSWR<PaymentInput[]>(`${APP_DOMAIN}/api/admin/escrow`, fetcher);

  return {
    escrows: escrows,
    loading: !escrows && !error,
    error,
  };
}
