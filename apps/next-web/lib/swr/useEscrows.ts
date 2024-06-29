import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { PaymentInput } from "../types";

export default function useEscrows() {
  const { data: escrows, error } = useSWR<PaymentInput[]>(
    `/api/admin/escrow`,
    fetcher
  );

  return {
    escrows: escrows,
    loading: !escrows && !error,
    error,
  };
}
