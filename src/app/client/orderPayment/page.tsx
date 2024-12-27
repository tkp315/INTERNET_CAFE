"use client"

import useApiToast from "@/hooks/useApiToast";
import Payment from "../components/payment"
import axios from "axios";
import { unskippableDialogType, updateDialog } from "@/app/redux/slices/filteration.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/app/Home/components/Navbar";
import { Button } from "react-day-picker";

function Page() {
    const apiCall = useApiToast()
    const [data,setData] = useState()
    async function checkTheLength(){
      // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\client\payment\fetch-all-payment-orders\route.ts
      const url = '/api/client/payment/fetch-all-payment-orders';
      const res = await apiCall(url,null,axios.get)
      if(res.statusCode===200 && res.success===true){
        const length = res.data.length;
        if(length===0)return;
        console.log(res.data);
        setData(res.data)
      }
      
    }
    useEffect(()=>{
      checkTheLength()
    },[])
     const dispatch = useDispatch();
     const openParam:unskippableDialogType = useSelector((state)=>state.filter).unskippableDialog
    
  return (
    <Navbar>
       <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
       {/* all cards */}

      </CardContent>
      
    </Card>
    </Navbar>
  )
}

export default Page
