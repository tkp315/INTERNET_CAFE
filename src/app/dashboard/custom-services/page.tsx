"use client"

import useApiToast from "@/hooks/useApiToast"
import { AppSidebar } from "../sidebar/AppSidebar"
import { useEffect, useState } from "react";
import axios from "axios";
import { CustomeServiceTable } from "./utils/custom-service-table";
import Navbar from "@/app/Home/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";
import { useSelector } from "react-redux";
import { Pagination } from "./data-table/data-table-pagination";

function Page() {
  const apiCall = useApiToast();
  const [tableData,setTableData] = useState<CustomeServiceTable[]>([]);
  const [paginationData,setPaginationData] = useState<Pagination>();
  const updatedParams = useSelector((state)=>state.filter);
  const filterOption = updatedParams.customRequestParameter;
  useEffect(()=>{
  async function fetchCustomServices(){
    const url = `/api/admin/other-services/fetch-request/dashboard-side?page=${filterOption.page}&limit=${filterOption.limit}`
  const res = await apiCall(url,null,axios.get)
  if(res && res.statusCode===200){
    setTableData(res.data.tableData);
    //   paginationData
    setPaginationData(res.data.paginationData)

  }

  console.log(res);
  }
  fetchCustomServices();
  },[filterOption])
  
  const isMobile = useIsMobile();
  const renderFunction = () => (
    <div className="flex flex-row gap-2 items-center">
      <AppSidebar />
      <DataTable 
     pagination= {{hasNextPage:paginationData?.hasNextPage, hasPreviousPage:paginationData?.hasPreviousPage,totalPages:paginationData?.totalPages,page:paginationData?.page}}      columns={columns} data={tableData} />
    </div>
  );
  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page
