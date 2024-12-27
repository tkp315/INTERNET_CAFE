"use client";

import { TaskType } from "@/app/schemas/taskSchema";
import { AppSidebar } from "../sidebar/AppSidebar";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import Navbar from "@/app/Home/components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserType } from "@/app/schemas/userTableSchema";
import useApiToast from "@/hooks/useApiToast";
import { useIsMobile } from "@/hooks/use-mobile";

function Page() {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const apiCall = useApiToast();
  async function getUsers() {
    const url = "/api/user/fetch-all";
    const res = await apiCall(url, null, axios.get);
    console.log(res);
    setUsers(res.data);
  }
  useEffect(() => {
    getUsers();
  }, []);
  console.log(users);
  const renderFunction = () => (
    <div className=" flex flex-row gap-2">
      <AppSidebar />
      <DataTable data={users} columns={columns} />
    </div>
  );
  const isMobile = useIsMobile();
  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page;
