"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "../sidebar/AppSidebar"
import useApiToast from "@/hooks/useApiToast";
import Navbar from "@/app/Home/components/Navbar";
import { DataTable } from "./data-table/data-table";
import axios from "axios";
import { columns } from "./data-table/columns";
import { useEffect, useState } from "react";
import { Pagination } from "../category/data-table/data-table";
import { useSelector } from "react-redux";
import { CompletionTable } from "./utils/CompletionTable";

function Page() {
  // /api/admin/completion/service-completed
  const [tableData, setTableData] = useState<CompletionTable[] >([]);
    const [paginationData, setPaginationData] = useState<Pagination>(
      {
        hasNextPage:false,
        hasPreviousPage:false,
        totalPages:0,
        page:1
      }
    );

    const updatedParams = useSelector((state)=>state.filter);
  const filterOption = updatedParams.completionRequestParameter;
  const isMobile = useIsMobile();
  const apiCall = useApiToast();
  async function fetchCompletionServices(){
    // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\completion\service-completed
    const url = `/api/admin/completion/service-completed?page=${filterOption.page}&limit=${filterOption.limit}`;
    const res = await apiCall(url,null,axios.get)
    console.log(res)
    if (res && res.statusCode === 200) {
      setPaginationData({hasNextPage:res.hasNextPage,
        hasPreviousPage:res.hasPreviousPage,
        totalPages:res.totalPages,
        page:res.page
      })
      setTableData(res.tableData);
    }
  }
  useEffect(()=>{
    fetchCompletionServices()
  },[filterOption])
  const renderFunction = () => (
    <div className="flex flex-row gap-2 items-center">
      <AppSidebar />
      <DataTable 
      pagination={{hasNextPage:paginationData.hasNextPage, hasPreviousPage:paginationData?.hasPreviousPage,totalPages:paginationData?.totalPages,page:paginationData.page}}
      columns={columns} data={tableData}  />
    </div>
  );
  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page
