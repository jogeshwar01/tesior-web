import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TransferInput } from "../types";

export default function useTransfers() {
  const { data: transfers, error } = useSWR<TransferInput[]>("/api/user/transfer", fetcher);

  return {
    transfers: transfers,
    loading: !transfers && !error,
    error,
  };
}
