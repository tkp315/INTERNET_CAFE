"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { PaymentStatus, Status } from "@/types/models.types"
import axios from "axios"
import { ServiceRequestTable } from "../utils/requestTablseSchema"
import useApiToast from "@/hooks/useApiToast"
import { useState } from "react"
interface StatusProp{
    requestId:string,
    status:string,
    statusData:typeof Status | typeof PaymentStatus;
}
function StatusSelection({requestId,status,statusData}:StatusProp) {
   
    const apiCall = useApiToast()
    const handleSelection=async (value:string)=>{
      
      const url = `/api/admin/service-requested/requests/update-status`
      const result = await apiCall(url,{requestId,status:value},axios.post)
      
      console.log(result);

    }

  return (
    <Select 
    value={status}
    onValueChange={(value)=>handleSelection(value)}>
    <SelectTrigger className="w-fit">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
     
      <SelectGroup>
      {
        Object.values(statusData).map((status)=>(
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))
      }
        {/* <SelectItem value={Status.Pending}>Pending</SelectItem>
        <SelectItem value={Status.Ongoing}>Ongoing</SelectItem>
        <SelectItem value={Status.Completed}>Completed</SelectItem> */}
      </SelectGroup>
    </SelectContent>
  </Select>
  )
}

export default StatusSelection
