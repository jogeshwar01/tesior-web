"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/new-york/badge";
import { PaymentInput } from "@/lib/types";
import { DataTableColumnHeader } from "../common/data-table-column-header";

export const statuses = [
  {
    value: "Processing",
    label: "Processing",
    variant: "outline",
  },
  {
    value: "Success",
    label: "Success",
    variant: "default",
  },
  {
    value: "Failure",
    label: "Failure",
    variant: "destructive",
  },
];

export const columns: ColumnDef<PaymentInput>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {(row.getValue("id") as string)?.substring(0, 8)}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status: any) => status.value === row.original.status
      );
      const variant: any = status?.variant;

      return (
        <div className="flex w-[100px] items-center">
          {status && <Badge variant={variant}>{status.label}</Badge>}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount: bigint = row.getValue("amount");
      if (!amount && amount != BigInt(0)) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{amount} SOL</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
