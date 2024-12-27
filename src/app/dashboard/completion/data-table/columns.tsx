"use client";

import { ColumnDef } from "@tanstack/react-table";


import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { CompletionTable } from "../utils/CompletionTable";
import StatusSelection from "../../service-request/components/status-select";
import { PaymentStatus } from "@/types/models.types";
import { FileText } from "lucide-react";
import NotificationButtons from "../../service-request/components/notification-catlog";
import PaymentStatusSelection from "../../custom-services/components/payment-status-selection";



export const columns: ColumnDef<CompletionTable>[] = [
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
      <DataTableColumnHeader column={column} title='Service' />
    ),
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("serviceName")}</div>
    },
  },

  {
    accessorKey: "servicePrice",
    header:"Amount",
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("servicePrice")}</div>
    },
  },
  {
    accessorKey: "clientPhone",
    header:"Phone ",
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("clientPhone")}</div>
    },
  },
  
  {
    accessorKey:'paymentStatus',
    header:'Payment',
    cell:({row})=>(
     <PaymentStatusSelection statusData={PaymentStatus} requestId={row.original.id} status={row.original.paymentStatus}/>
    )
  },
 
  {
     accessorKey:'response_reciept',
     header:"Response",
     cell:({row})=>(
       <div className='cursor-pointer hover:text-blue-500 hover:underline text-blue-300'>
      <a href={row.getValue("formLink")} className="flex flex-row gap-1 items-center">
        <FileText/> PDF
      </a>
     </div>
     )
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