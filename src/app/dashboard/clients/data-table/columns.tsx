"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { UserType } from "@/app/schemas/userTableSchema";
import { CategoryType } from "@/app/schemas/categoryTableSchema";


export const columns: ColumnDef<CategoryType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label='Select row'
        // className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("name")}</div>
    },
  },

  {
    accessorKey: "email",
    header:"Email",
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("email")}</div>
    },
  },
  {
    accessorKey: "phoneNo",
    header:"Phone Number",
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("phoneNo")}</div>
    },
  },
  
 
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];