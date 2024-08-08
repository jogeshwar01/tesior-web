"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardInput } from "@/lib/types";
import { DataTableColumnHeader } from "../common/data-table-column-header";

export const columns: ColumnDef<LeaderboardInput>[] = [
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Github Username" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] flex">
        <a
          href={`https://github.com/${row.getValue("user_name")}`}
          target="_blank"
          className="w-[100%] hover:underline"
        >
          {row.getValue("user_name")}
        </a>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bounty_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bounty Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("bounty_amount")} SOL</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "project_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Count" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px] flex">
          <div className="w-[100%]">{row.getValue("project_count")}</div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
