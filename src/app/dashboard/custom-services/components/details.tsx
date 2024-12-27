"use client";

import { Row } from "@tanstack/react-table";
import { CompletionTable } from "../utils/CompletionTable";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomeServiceTable } from "../utils/custom-service-table";
import { useState } from "react";
import { PaymentType } from "@/types/models.types";
import { Input } from "@/components/ui/input";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface PaymentDetails{
    paymentType?:PaymentType,
    paymentId?:string,
    paymentOrderId?:string,
    amount?:number,
}

function Details<TData>({ row }: DataTableRowActionsProps<TData>) {
const data:CustomeServiceTable = row.original;

const clientDetails = {
    name:data.clientName,
    phone:data.clientName,
    email:data.clientEmail
}

const paymentDetails:PaymentDetails = {
    paymentType:data.paymentType,
    paymentId:data.paymentId,
    paymentOrderId:data.orderId,
    amount:data.amount
}

const requestDetails ={
 response_receipt:data.response_receipt,
 files:data.files,
 id:data.id,
 name:data.name
}
const [amount,setAmount] = useState(0);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Details</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Request Details </SheetTitle>
        </SheetHeader>

        {/* tabs */}

        <Tabs defaultValue="request" className="w-full mt-3 mb-3">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="amount">Amount</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="request">Service</TabsTrigger>
          </TabsList>
          <TabsContent value="amount">
            <Card className=" w-fit space-y-2">
                <CardTitle>Add Amount</CardTitle>
                <CardContent>
                    <Input
                    name="addAmount"
                    onChange={(e)=>setAmount(Number(e.target.value))}
                    type="number"
                    />
                </CardContent>
                <CardFooter>
                    <Button variant="outline">Save</Button>
                </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <ScrollArea className="h-[calc(100vh-100px)]">
            <CardContent className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {Object.entries(paymentDetails).map(([key, value], idx) => (
                      <div
                        key={idx}
                        className="flex flex-row items-center gap-3"
                      >
                        <span className="font-semibold ">
                          {key.toUpperCase()}
                        </span>
                        <span className="">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="client">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <Card>
                <CardHeader>
                  <CardTitle>Client Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {Object.entries(clientDetails).map(([key, value], idx) => (
                      <div
                        key={idx}
                        className="flex flex-row items-center gap-3"
                      >
                       {key==='files' ?(
                        <div className="flex flex-row items-center gap-3">
                            <span className="font-semibold ">
                            {key.toUpperCase()}</span>
                        <div className="flex flex-col gap-1">
                          {
                            value.split(',').map((val,idx)=>(
                                <a  key={idx}href={val}>File {idx}</a>
                            ))
                          }
                        </div>
                        </div>
                       ):(<>
                        <span className="font-semibold ">
                          {key.toUpperCase()}
                        </span>
                        <span className="">{value}</span>
                       </>)}
                      
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="request">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
  <div className="flex flex-col gap-2">
    {Object.entries(requestDetails).map(([key, value], idx) => (
      <div key={idx} className="flex flex-row items-center gap-3">
        {key === "files" ? (
          <div className="flex flex-row gap-3">
            <span className="font-semibold">{key.toUpperCase()}</span>
            <div className="flex flex-col gap-1">
              {Array.isArray(value) ? (
                value.map((fileUrl, idx) => (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    File {idx + 1}
                  </a>
                ))
              ) : (
                <span className="text-gray-500">No files available</span>
              )}
            </div>
          </div>
        ) : (
          <>
            <span className="font-semibold">{key.toUpperCase()}</span>
            <span className="">{value || "N/A"}</span>
          </>
        )}
      </div>
    ))}
  </div>
</CardContent>

              </Card>
            </ScrollArea>
          </TabsContent>

          
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default Details;




