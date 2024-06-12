"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/new-york/badge";
import { Checkbox } from "@/components/ui/new-york/checkbox";

import { TaskInput } from "@/lib/types";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const statuses = [
  {
    value: "Pending",
    label: "Pending",
    variant: "outline",
  },
  {
    value: "Approved",
    label: "Approved",
    variant: "default",
  },
  {
    value: "Rejected",
    label: "Rejected",
    variant: "destructive",
  },
  {
    value: "Paid",
    label: "Paid",
    variant: "default",
  },
];

export const columns: ColumnDef<TaskInput>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
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
      const amount = row.getValue("amount") as string;
      if (!amount) {
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
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
