import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { PaymentInput } from "../types";
import { APP_DOMAIN } from "../utils/constants";

export default function usePayments() {
  const { data: payments, error } = useSWR<PaymentInput[]>(`${APP_DOMAIN}/api/user/payment`, fetcher);

  return {
    payments: payments,
    loading: !payments && !error,
    error,
  };
}
