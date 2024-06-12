"use client";

import { columns } from "@/components/table/transfer/columns";
import { DataTable } from "@/components/table/transfer/data-table";
import z from "zod";
import { Transfer } from "@/lib/types";
import useTransfers from "@/lib/swr/useTransfers";

export default function PaymentPage() {
  const { transfers: data, error, loading } = useTransfers();

  if (error) return <div>Failed to load transfers</div>;
  if (loading) return <div>Loading...</div>;

  const transfers = z.array(Transfer).parse(data);

  return (
    <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transfers!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of the Transfers you have received.
          </p>
        </div>
      </div>
      <DataTable data={transfers} columns={columns} />
    </div>
  );
}
