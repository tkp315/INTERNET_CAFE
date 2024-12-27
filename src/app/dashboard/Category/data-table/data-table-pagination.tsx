import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import useApiToast from "@/hooks/useApiToast";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  CategoryParameterType,
  CategoryResultType,
  updateCategoryParameter,
} from "@/app/redux/slices/filteration.slice";
import { useSelector } from "react-redux";
import { Pagination } from "./data-table";
import page from "../../notification/page";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  pagination: Pagination;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  pagination,
}: DataTablePaginationProps<TData>) {
  const dispatch = useDispatch();
  const updatedParam = useSelector((state) => state.filter);
  const params: CategoryParameterType = updatedParam.categoryParameter;

 
  const [paginationParameter, setPaginationParameter] =
    useState<CategoryParameterType>({
      limit: params.limit,
      page: params.page,
    });
  useEffect(() => {
    dispatch(updateCategoryParameter(paginationParameter));
  }, [pageSizeOptions]);

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
            value={`${paginationParameter.limit}`}
            onValueChange={(value) => {
              setPaginationParameter({
                ...paginationParameter,
                limit: Number(value),
                page:1
              });
              table.setPageSize(Number(value));
            }}
            defaultValue={`${5}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={paginationParameter.limit} />
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {pagination.totalPages || "Loading.."}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              setPaginationParameter({ ...paginationParameter, page: 1 });
            }}
            disabled={!pagination.hasPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage();
              setPaginationParameter({
                ...paginationParameter,
                page: paginationParameter.page - 1,
              });
            }}
            disabled={!pagination.hasPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
              setPaginationParameter({
                ...paginationParameter,
                page: paginationParameter.page + 1,
              });
            }}
            disabled={!pagination.hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              setPaginationParameter({
                ...paginationParameter,
                page: pagination.totalPages,
              })
            }
            disabled={!pagination.hasNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
