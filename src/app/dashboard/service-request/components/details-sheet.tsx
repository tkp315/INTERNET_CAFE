"use client";

import { Row } from "@tanstack/react-table";
import { ServiceRequestTable } from "../utils/requestTablseSchema";
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

function Details<TData>({ row }: DataTableRowActionsProps<TData>) {
  console.log(row.original);
  const data: ServiceRequestTable = row.original;
  const functions = row.original.requestedFunctions.map((f) => {
    if (typeof f !== "object") {
      return f;
    }
  });
  const clientDetails = {
    name: data.clientName,
    email: data.clientEmail,
    phone: data.clientPhone,
  };
  const serviceDetails = {
    name: data.serviceName,
    price: data.servicePrice,
  };
  const completionDetails = {
    interval: data.interval,
    date: new Date(data.date).toDateString(),
  };
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
            <TabsTrigger value="function">Function</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="completion">Expectation</TabsTrigger>
          </TabsList>
          <TabsContent value="function">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="flex flex-col gap-2">
                {functions.map((fun: string, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle>
                        {typeof fun === "object"
                          ? "User Specified"
                          : "Function Opted"}
                      </CardTitle>
                      <p>{idx}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {typeof fun === "object" && fun.other ? fun.other : fun}
                    </CardContent>
                  </Card>
                ))}
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

          <TabsContent value="completion">
            <ScrollArea className="h-[(100vh-100px)]">
              <Card>
                <CardHeader>
                  <CardTitle>Expected Completion Date</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {Object.entries(completionDetails).map(
                      ([key, value], idx) => (
                        <div
                          key={idx}
                          className="flex flex-row items-center gap-3"
                        >
                          <span className="font-semibold ">
                            {key.toUpperCase()}
                          </span>
                          <span className="">{value}</span>
                        </div>
                      )
                    )}
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
