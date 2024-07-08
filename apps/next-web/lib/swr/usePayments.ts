import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { PaymentInput } from "../types";

export default function usePayments() {
  const { data: payments, error } = useSWR<PaymentInput[]>(
    `/api/payment`,
    fetcher
  );

  return {
    payments: payments,
    loading: !payments && !error,
    error,
  };
}
