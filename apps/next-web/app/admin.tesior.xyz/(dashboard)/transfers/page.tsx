"use client";

import { columns } from "@/components/table/transfer/columns";
import { DataTable } from "@/components/table/transfer/data-table";
import z from "zod";
import { Transfer } from "@/lib/types";
import useTransfers from "@/lib/swr/useTransfers";

export default function PaymentPage() {
  const { transfers: sent, error, loading } = useTransfers('sent');
  const { transfers: received, error: receivedError, loading: receivedLoading } = useTransfers('received');

  if (error) return <div>Failed to load sent transfers</div>;
  if (loading) return <div>Loading...</div>;

  if (receivedError) return <div>Failed to load received transfers</div>;
  if (receivedLoading) return <div>Loading...</div>;

  const sentTransfers = z.array(Transfer).parse(sent);
  const receivedTransfers = z.array(Transfer).parse(received);

  return (
    <>
      <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sent!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of the Transfers you have sent.
            </p>
          </div>
        </div>
        <DataTable data={sentTransfers} columns={columns} />
      </div>

      <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 pt-10 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Received!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of the Transfers you have received.
            </p>
          </div>
        </div>
        <DataTable data={receivedTransfers} columns={columns} />
      </div>
    </>
  );
}
