"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { DataTableFacetedFilter } from "./data-table-faceted-filter"


import { X } from "lucide-react"
// import { priority_options,status_options } from "@/lib/filters"
import { DataTableViewOptions } from "./data-table-view-options"
import SelectRows from "../components/selectRows"
// import AddCategory from "../components/AddCategory"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows =  table.getSelectedRowModel().rows;
  const selectedRowsData = selectedRows.map((row)=>row.original)
console.log("Selected Rows",selectedRows)
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {
        selectedRows && <SelectRows selectedRowsData={selectedRowsData}/>
      }
      <DataTableViewOptions table={table} />
    </div>
  )
}