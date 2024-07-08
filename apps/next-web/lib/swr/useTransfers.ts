import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TransferInput } from "../types";

type Transfer = "sent" | "received";

export default function useTransfers(sentOrReceived: Transfer) {
  const { data: transfers, error } = useSWR<TransferInput[]>(
    `/api/transfer?transfer=${sentOrReceived}`,
    fetcher
  );

  return {
    transfers: transfers,
    loading: !transfers && !error,
    error,
  };
}
