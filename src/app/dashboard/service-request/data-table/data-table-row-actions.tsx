"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { categorySchema } from "@/app/schemas/categoryTableSchema";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Details from "../components/details-sheet";
import NotificationSheet from "../components/notification-sheet";


interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const category = categorySchema.parse(row.original);
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="px-6 py-2"
              onClick={() => navigator.clipboard.writeText(row.getValue('clientPhone'))}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Client Phone 
            </DropdownMenuItem>
            
          </DropdownMenuGroup>
         <div className="flex flex-col gap-3 justify-center w-full">
         <Details row={row}/>
         <NotificationSheet url={`\api\admin\notification-service-life\fetch`} requestId={row.original.id}/>
         </div>
         
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
