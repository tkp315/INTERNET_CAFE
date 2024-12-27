"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { ServiceRequestTable } from "../utils/requestTablseSchema";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import StatusSelection from "../components/status-select";
import NotificationButtons from "../components/notification-catlog";
import { Status } from "@/types/models.types";


export const columns: ColumnDef<ServiceRequestTable>[] = [
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
    accessorKey: "serviceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Service Name' />
    ),
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("serviceName")}</div>
    },
  },
 
 
  {
    accessorKey: "clientName",
    header: ({column})=>{
      return <DataTableColumnHeader title="Client Name" column={column}/>
    },
    cell: ({ row }) => <div className=''>{row.getValue("clientName")}</div>,
  },

  {
    accessorKey:'clientPhone',
    header:"Client Phone",
    cell:({row})=>{
      
      return <div className="">{row.getValue('clientPhone')}</div>
    }
  },
{
  accessorKey:'date',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Completion Date' />
  ),
  cell: ({ row }) => {
    const val = new Date(row.getValue('date')).toDateString()

   return  <div className={`${new Date(row.getValue('date'))-new Date()<=1?`text-red-700`:``}`}>{val}</div>
  },
},

{
  accessorKey:'interval',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Interval' />
  ),
  cell: ({ row }) => {
    

   return  <div className="">{row.getValue('interval')}</div>
  },
},




{
  accessorKey:'formLink',
  header:"Form Details",
  cell: ({ row }) => {
   return  <div className='cursor-pointer hover:text-blue-500 hover:underline text-blue-300'>
    <a href={row.getValue("formLink")} className="flex flex-row gap-1 items-center">
      <FileText/> PDF
    </a>
   </div>
  },
},
{
  accessorKey:'status',
  header:({column})=>(
    <DataTableColumnHeader  column={column} title="Status"/>
  ),
  cell:({row})=>{
   
    return (<StatusSelection  statusData={Status} requestId={row.original.id} status={row.original.status}/>)
  }
},
{
  accessorKey:'createdAt',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Created At' />
  ),
  cell: ({ row }) => {
    const val = new Date(row.getValue('createdAt')).toDateString()
   return  <div className=''>{val}</div>
  },
},
{
id:'notifications',
header:"Send Message",
cell:({row})=>{
 return (<NotificationButtons clientId={row.original.clientId} requestId={row.original.id} />)
}
},
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];