"use client";
import axios from "axios";
import { AppSidebar } from "../sidebar/AppSidebar";
import AddCategory from "./components/AddCategory";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useEffect, useState } from "react";
import { CategoryType } from "@/app/schemas/categoryTableSchema";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { FiLoader } from "react-icons/fi";
import useApiToast from "@/hooks/useApiToast";
import Navbar from "@/app/Home/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSelector } from "react-redux";
import {
  CategoryParameterType,
  updateCategoryResult,
} from "@/app/redux/slices/filteration.slice";
import { useDispatch } from "react-redux";
function Page() {
  const [categories, setCategories] = useState([]);
  const [tableData, setTableData] = useState<Array<CategoryType>>([]);
  const { toast } = useToast();
  const apiCall = useApiToast();
  const updatedParam = useSelector((state) => state.filter);
  const filterOptions: CategoryParameterType = updatedParam.categoryParameter;
  console.log(updatedParam);
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState({});

  async function getAllCategories() {
    const url = `/api/admin/fetch/category?dateInterval=${
      filterOptions.dateInterval || ""
    }&categoryName=${filterOptions.name || ""}&availability=${
      filterOptions.availability || ""
    }&limit=${filterOptions.limit || ""}&page=${filterOptions.page || ""}`;
    const res = await apiCall(url, null, axios.get);
    console.log(res);
    setTableData(res.data.tableData);
    setPaginationData(res.data.paginationParameters)
  }
  console.log(paginationData)
  
  useEffect(() => {
      getAllCategories(); 
  }, [filterOptions,dispatch]); 

  const renderFunction = () => (
    <div className="flex flex-row gap-3">
      <AppSidebar />
      <DataTable pagination={{hasNextPage:paginationData.hasNextPage, hasPreviousPage: paginationData.hasPreviousPage,
        totalPages: paginationData.totalPages}} columns={columns} data={tableData} />
    </div>
  );

  const isMobile = useIsMobile();
  return (
    <>{isMobile ? <Navbar>{renderFunction()}</Navbar> : renderFunction()}</>
  );
}

export default Page;
