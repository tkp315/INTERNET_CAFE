"use client";

import { useSocket } from "@/app/context/SocketProvider";
import Navbar from "@/app/Home/components/Navbar";
import { removeProcessingData, removeSelectedService } from "@/app/redux/slices/services.slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function Page() {
  const serviceDetails = useSelector((state) => state.services);
  const service = serviceDetails.selectedService;
  const processingData = serviceDetails.processingServiceData;
  console.log(processingData);
  console.log(service);

  const {selectedFunctions,clientFormDetails,availability}=processingData
  const {thumbnail,servicePrice,categoryName
,serviceName  }= service

const functions = selectedFunctions.map((fun)=>typeof fun!=='object')
const isMobile = useIsMobile()
const dataToSend = {service,processingData}
const [isServiceRequested,setIsServiceRequested] = useState(false);
const[requestedData,setRequestedData] = useState();

const dispatch = useDispatch()
const router = useRouter();
async function submission(){
  const res = await axios.post(`/api/admin/service-requested/build-service/pdf-conversion`,{selectedServiceData:dataToSend});
  if(res.data.statusCode===200){
    setRequestedData(res.data.data)
    const response = await axios.post('/api/send-request-to-admin',{serviceName:"Service Requested",functions:functions})
    console.log(response);
   setIsServiceRequested(true)
   if(response.data.statusCode===200){
   dispatch(removeProcessingData());
   dispatch(removeSelectedService());
   router.push('/')
   }

  }
  console.log(res);
}



  return (
    <Navbar>
      <div className={`container mx-auto py-10 px-6 ${isMobile? `mb-16`:``} `}>
      <Card className="shadow-md border border-gray-200 rounded-lg hover:shadow-chart-1">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-chart-1">Summary</CardTitle>
          <CardDescription className="">
            This is the summary of the entire process. Once you click "Done," you
            can't go back. If you click "Cancel," you won't be able to proceed
            further, and you will have to restart the process.
          </CardDescription>
        </CardHeader>

        <Separator className="my-4" />

        <CardContent className="space-y-6 ">
          <div>
            <CardTitle className="text-xl font-semibold">Service Details</CardTitle>
            <div className="flex flex-row items-start gap-6 mt-4">
              <img
                alt="thumbnail"
                src={thumbnail || ""}
                width={120}
                height={120}
                className="object-cover rounded-lg border border-border"
              />
              <div className="flex flex-col space-y-2 text-chart-2">
                <span><strong>Service Name:</strong> {serviceName|| "N/A"}</span>
                <span><strong>Category Name:</strong> {categoryName|| "N/A"}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <CardTitle className="text-xl font-semibold">Functions</CardTitle>
            <div className="flex flex-col space-y-2 text-chart-2 mt-4">
              {selectedFunctions?.map((f, idx) => (
                <span key={idx}>{typeof f !== "object" ? f : ""}</span>
              )) || <span>No functions selected.</span>}
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <CardTitle className="text-xl font-semibold">Form Details</CardTitle>
            <div className="flex flex-col text-chart-2 mt-4 space-y-2">
              <span><strong>PDFs Uploaded:</strong> {clientFormDetails.urls?.length || 0}</span>
              <span><strong>Total Input Fields:</strong> {clientFormDetails.jsonData?.length || 0}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <CardTitle className="text-xl font-semibold">Expected Time to Complete</CardTitle>
            <div className="flex flex-col text-chart-2 mt-4 space-y-2">
              <span><strong>Date:</strong> {new Date(availability?.date).toDateString()}</span>
              <span><strong>Time Period:</strong> {availability?.startTime} - {processingData?.availability?.endTime}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <CardTitle className="text-xl font-semibold">Bill</CardTitle>
            <div className="text-chart-2 mt-4">
              <span><strong>Price:</strong> ₹{Number(servicePrice) || 0}</span>
            </div>
          </div>
        </CardContent>

        <Separator className="my-4" />

        <CardFooter className="flex justify-end gap-4">
          <Button variant="destructive" >
            Cancel
          </Button>
          <Button 
          onClick={submission}
          variant='default' 
          >
            Done
          </Button>
        </CardFooter>
      </Card>
    </div>
    </Navbar>
  );
  
}

export default Page;
