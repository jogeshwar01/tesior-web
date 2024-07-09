"use client";

import { columns } from "@/components/table/payment/columns";
import { columns as escrowColumns } from "@/components/table/payment/columns";
import { DataTable } from "@/components/table/payment/data-table"; //using common data-table component
import z from "zod";
import { Payment, Escrow } from "@/lib/types";
import usePayments from "@/lib/swr/usePayments";
import useEscrows from "@/lib/swr/useEscrows";

export default function PaymentPage() {
  const { payments: data, error, loading } = usePayments();
  const {
    escrows: escrowData,
    error: escrowError,
    loading: escrowLoading,
  } = useEscrows();

  if (error) return <div>Failed to load payments</div>;
  if (loading) return <div>Loading...</div>;

  if (escrowError) return <div>Failed to load escrows</div>;
  if (escrowLoading) return <div>Loading...</div>;

  const payments = z.array(Payment).parse(data);
  const escrows = z.array(Escrow).parse(escrowData);

  return (
    <>
      <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Payments!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of the payments you have received.
            </p>
          </div>
        </div>
        <DataTable data={payments} columns={columns} />
      </div>
      <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 pt-20 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Escrows!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of the escrows you have initiated.
            </p>
          </div>
        </div>
        <DataTable data={escrows} columns={escrowColumns} />
      </div>
    </>
  );
}
