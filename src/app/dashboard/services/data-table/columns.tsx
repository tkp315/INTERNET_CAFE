"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ServiceType } from "../utils/serviceTableSchema";


export const columns: ColumnDef<ServiceType>[] = [
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
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className=''>{row.getValue("category")}</div>,
  },

  {
    accessorKey:'isAvailable',
    header:"Is Available",
    cell:({row})=>{
      const val = row.getValue('isAvailable')
      return <div className="">{val?"True":"False"}</div>
    }
  },

  {
   accessorKey:'price',
   header:({column})=>{
   return <DataTableColumnHeader column={column} title="Price"/>
   },
   cell:({row})=>{
    const value = row.getValue('price')as number;
    return <div>{value}</div>
   }
  },

  {
    accessorKey:'createdBy',
    header:"Created By",
    cell:({row})=>{
      return <div className="">{row.getValue('createdBy')}</div>
    }
  },

  {
    accessorKey:'createdAt',
    header:({column})=>{return <DataTableColumnHeader column={column} title="Creation Date"/>},
    cell:({row})=>{
      const val = row.getValue('createdAt')as string;
      const date = new Date(val);
      return <div className="w-fit">{date.toDateString()}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];