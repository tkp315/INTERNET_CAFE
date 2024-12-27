"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
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
    accessorKey: "services",
    header: ({column})=>{
      return <DataTableColumnHeader title="Total Services" column={column}/>
    },
    cell: ({ row }) => <div className=''>{row.getValue("services")}</div>,
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
    accessorKey:'createdBy',
    header:"Created By",
    cell:({row})=>{
      return <div className="">{row.getValue('createdBy')}</div>
    }
  },

  {
    accessorKey:'updatedAt',
    header:({column})=>{return <DataTableColumnHeader column={column} title="Creation Date"/>},
    cell:({row})=>{
      const val = row.getValue('updatedAt')as string;
      // const date = new Date(val);
      return <div className="">{val}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];