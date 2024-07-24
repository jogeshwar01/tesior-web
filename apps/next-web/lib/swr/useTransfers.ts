import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TransferInput } from "../types";

type Transfer = "sent" | "received";

export default function useTransfers(sentOrReceived: Transfer, workspaceId?: string) {
  const { data: transfers, error } = useSWR<TransferInput[]>(
    `/api/transfer?transfer=${sentOrReceived}&workspaceId=${workspaceId}`,
    fetcher
  );

  return {
    transfers: transfers,
    loading: !transfers && !error,
    error,
  };
}
