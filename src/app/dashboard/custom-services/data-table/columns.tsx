"use client";

import { ColumnDef } from "@tanstack/react-table";


import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import StatusSelection from "../../service-request/components/status-select";
import { PaymentStatus, Status } from "@/types/models.types";
import { FileText } from "lucide-react";

import { CustomeServiceTable } from "../utils/custom-service-table";
import PaymentStatusSelection from "../components/payment-status-selection";
import NotificationButtons from "../components/notification";



export const columns: ColumnDef<CustomeServiceTable>[] = [
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
      <DataTableColumnHeader column={column} title='Service' />
    ),
    cell: ({ row }) => {
     return  <div className=''>{row.getValue("name")}</div>
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
     accessorKey:'interval',
     header:"Interval",
     cell:({row})=>(
      <div className="">{row.getValue('interval')}</div>
     )

  },
  {
    accessorKey:'date',
    header:"Deadline",
    cell:({row})=>{
      const val = new Date(row.getValue('date')).toDateString()
     return <div className="">{val}</div>
    }

 },
  {
    accessorKey:'status',
    header:'Order Status',
    cell:({row})=>(
     <StatusSelection 
     url={`/api/admin/other-services/update-status`}
     statusData={Status} requestId={row.original.id} status={row.original.status}/>
    )
  },
  {
    accessorKey:'paymentStatus',
    header:'Payment',
    cell:({row})=>(
     <PaymentStatusSelection  requestId={row.original.id} status={row.original.paymentStatus||PaymentStatus.Unpaid}/>
    )
  },
 
  {
    id:'notifications',
    header:"Send Message",
    cell:({row})=>{
     return (<NotificationButtons clientId={row.original.clientId} requestId={row.original.id} row={row}/>)
    }
  },
  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];