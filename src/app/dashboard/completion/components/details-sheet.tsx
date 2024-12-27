"use client";
import { CompletionTable } from "../utils/CompletionTable";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableRowActionsProps {
  row:CompletionTable
}

function Details({ row }: DataTableRowActionsProps) {

const data:CompletionTable = row;
const clientDetails = {
    name:data.clientName,
    phone:data.clientName,
    email:data.clientEmail,
    id:data.clientId
}

const paymentDetails = {
  id:data.paymentId,
  type:data.paymentType,
  status:data.paymentStatus,
  orderId: data.orderId,
  amount:  data.amount,
  response_receipt:data.response_receipt
}
const serviceDetails = {
  name:data.serviceName,
  id:data.serviceId,
}
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

        <Tabs defaultValue="function" className="w-full mt-3 mb-3">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>
          <TabsContent value="payment">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="flex flex-col gap-2">
               
                  <Card >
                    <CardHeader>
                      <CardTitle>
                      Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                     {/* content */}
                     {Object.entries(paymentDetails).length===0?(" Payment Details not Found"):Object.entries(paymentDetails).map(([key, value], idx) => (
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
                    </CardContent>
                  </Card>
                
              </div>
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
                        <span className="font-semibold ">
                          {key.toUpperCase()}
                        </span>
                        <span className="">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="service">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {Object.entries(serviceDetails).map(([key, value], idx) => (
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
              </Card>
            </ScrollArea>
          </TabsContent>

          
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default Details;




