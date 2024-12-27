"use client";
import { useEffect, useState } from "react";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import axios from "axios";
import { ServiceRequestTable } from "./utils/requestTablseSchema";
import { AppSidebar } from "../sidebar/AppSidebar";
import Navbar from "@/app/Home/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import useApiToast from "@/hooks/useApiToast";
import { Pagination } from "./data-table/data-table-pagination";
import { useSelector } from "react-redux";

function Page() {
  const [tableData, setTableData] = useState<ServiceRequestTable[] >([]);
  const [paginationData, setPaginationData] = useState<Pagination>(
    {
      hasNextPage:false,
      hasPreviousPage:false,
      totalPages:0,
      page:1
    }
  );
  const apiCall = useApiToast()
  const updatedParams = useSelector((state)=>state.filter);
  const filterOption = updatedParams.requestParameter;

  useEffect(() => {
    async function handleData() {
      // \api\admin\service-requested\requests\route.ts
      const res = await apiCall(`/api/admin/service-requested/requests?page=${filterOption.page}&limit=${filterOption.limit}`,null,axios.get);
      console.log(res);
      if (res && res.statusCode === 200) {
        setPaginationData({hasNextPage:res.hasNextPage,
          hasPreviousPage:res.hasPreviousPage,
          totalPages:res.totalPages,
          page:res.page
        })
        setTableData(res.tableData);
      }
    }
    handleData();
  }, [filterOption]);
  console.log(paginationData);
  console.log(tableData);
  const renderFunction = () => (
    <div className="flex flex-row gap-2 items-center">
      <AppSidebar />
      <DataTable columns={columns}pagination={{hasNextPage:paginationData.hasNextPage, hasPreviousPage:paginationData?.hasPreviousPage,totalPages:paginationData?.totalPages,page:paginationData.page}} data={tableData} />
    </div>
  );
  const isMobile = useIsMobile();
  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page;
