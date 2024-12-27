import { type Table } from "@tanstack/react-table"
  
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { CustomRequestParameterType, updateCustomParameter } from "@/app/redux/slices/filteration.slice"

export interface Pagination{
  totalPages:number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  page:number
}
interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[],
  pagination:Pagination
}


export function DataTablePagination<TData>({
  table,
  pagination,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const [parameter,setParameter] = useState<CustomRequestParameterType>({
    limit:10,
    page:1,
  })
  const dispatch = useDispatch();
  useEffect(()=>{
   dispatch(updateCustomParameter(parameter))
  },[parameter])

  return (
    <div className="flex items-center justify-between px-2">
    <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div className="flex items-center space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${parameter.limit}`}
          onValueChange={(value) => {
            setParameter({...parameter,limit:Number(value),page:1})
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={parameter.limit}/>
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
      Page {pagination.page} of{" "}
      {pagination.totalPages}
       
      </div>
      <div className="flex items-center space-x-2">
      <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setParameter({...parameter,page:1})}
          disabled={!pagination.hasPreviousPage}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setParameter({...parameter,page:parameter.page-1})}
          disabled={!pagination.hasPreviousPage}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() =>setParameter({...parameter,page:parameter.page+1})}
          disabled={!pagination.hasNextPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setParameter({...parameter,page:pagination.totalPages})}
          disabled={!pagination.hasNextPage}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
  )
}