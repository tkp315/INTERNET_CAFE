"use client";

import axios from "axios";
import { AppSidebar } from "../sidebar/AppSidebar";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useEffect, useState } from "react";
import { ServiceType } from "./utils/serviceTableSchema";
import { FiLoader } from "react-icons/fi";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/app/Home/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import useApiToast from "@/hooks/useApiToast";

function Page() {
  const [tableData, setTableData] = useState<Array<ServiceType>>([]);
  const { toast } = useToast();
  const apiCall = useApiToast();

  async function getServices() {
    const url = "/api/admin/services/fetch";
    const res = await apiCall(url, null, axios.get);
    if (res.statusCode === 200) {
      setTableData(res.data.tableData);
    }
  }
  useEffect(() => {
    getServices();
  }, []);
  const renderFunction = () => (
    <div className=" flex flex-row gap-3 overflow-hidden">
      <AppSidebar />
      <DataTable columns={columns} data={tableData} />
    </div>
  );
  const isMobile = useIsMobile();

  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page;
