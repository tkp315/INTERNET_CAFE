"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SERVICE_STATUS } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useActionState, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus, Status } from "@/types/models.types";
import { MdOutlineCallMissedOutgoing, MdPending } from "react-icons/md";
import { File, TicketX } from "lucide-react";
import { FaRandom } from "react-icons/fa";
import { Laptop } from "lucide-react"; // Ongoing
import { Clock } from "lucide-react"; // Pending
import { CheckCircle } from "lucide-react"; // Completed
import { RefreshCcw } from "lucide-react"; // Default or random
import Navbar from "@/app/Home/components/Navbar";
import Link from "next/link";
import Payment from "../components/payment";
import useApiToast from "@/hooks/useApiToast";
import { ServiceRequestTable } from "@/app/dashboard/service-request/utils/requestTablseSchema";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pagination } from "@/app/dashboard/category/data-table/data-table";
import useDebounce from "@/hooks/useDebounce";
import { OrderFilteration } from "@/app/redux/slices/filteration.slice";
import { useSelector } from "react-redux";

interface Data{
    CompletionDetails:{
        createdAt:string,
        date:string,
        endTime:string,
        startTime:string,
    },
    ServiceDetails:{
        name:string,
        price:string,
        id:string,
        thumbnail?:string
    },
    client:string,
    createdAt:string,
    description:string,
    formDetails:string,
    requestedFunction:string[],
    status:Status,
    _id:string,
    paymentStatus:PaymentStatus,

    taskCompletion:{
        response_receipt:string,
        request:string,
        paymentDetails:string,
        paymentStatus:PaymentStatus
    }
    updatedAt:string
}
interface PaginationDataType{
    totalPages:number,
    hasNextPage:boolean,
    hasPreviousPage:boolean,
    page:number,
    limit:number,
    totalDocs:number
}

function ServiceRequests() {
  const [requests, setRequests] = useState<Data[]>([]);
  const [paginationData,setPaginationData] = useState<PaginationDataType>();
  const apiCall = useApiToast();
  const [searchParams, setSearchParams] = useState("");
  const query = useDebounce(searchParams,300);
  const filterOptions:OrderFilteration = useSelector((state)=>state.filter).serviceOrderParameter
  async function fetchService() {
    const url = `/api/user/fetch-requested-services?search=${query||''}&page=${filterOptions.page}&ongoing=${filterOptions.ongoing}&completed=${filterOptions.completed}&pending=${filterOptions.pending}&paid=${filterOptions.paid}&unpaid=${filterOptions.unpaid}`;
    const res = await apiCall(url, null, axios.get);
    // const res = await axios.get("/api/user/fetch-requested-services");
    console.log(res);
    if (res && res.statusCode === 200) {
      setRequests(res.data.requestData);
      setPaginationData(res.data.paginationData)
    }
  }
  useEffect(() => {
    fetchService();
  }, []);
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-10 px-10 py-4 ">
      {/* Filters Sidebar */}

      {/* Requests Section */}

      <ScrollArea className="h-[calc(100vh-100px)] w-full">
        <div className="flex flex-col gap-3 justify-center">
          {/* Search */}
          <div className="flex gap-2 w-full mb-4">
            <Input
              onChange={(e) => setSearchParams(e.target.value)}
              type="text"
              className="w-full border border-foreground "
              placeholder="Search services"
            />
          </div>

          {/* Requests */}
          {requests?.length === 0
            ? "No Requests"
            : requests.map((item, idx) => (
                <Card
                  key={idx}
                  className="w-full shadow-lg hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>
                        {item.ServiceDetails.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`flex ${
                        isMobile ? `flex-col` : `flex-row`
                      } gap-10 px-4 py-2`}
                    >
                      <img
                        className="w-48 h-32 object-cover rounded-lg border"
                        src={
                          item?.ServiceDetails.thumbnail ||
                          `https://img.freepik.com/free-vector/interaction-with-customer-online-service-platform-marketing-technique-client-retention-idea-communication-with-customers-flat-vector-illustration_613284-110.jpg`
                        }
                        alt="Service Thumbnail"
                      />

                      <div className="flex flex-col gap-3">
                        <span>{item?.ServiceDetails.name || "Service"}</span>

                        {/* Status Badge */}
                        <div className="flex flex-row gap-4 ">
                          <span className="">Function Selected</span>
                          <div>
                            {item.requestedFunction?.length === 0
                              ? "No Function Selected"
                              : item.requestedFunction.map((fun) => {
                                  if (fun) {
                                    return <span className="mr-2 ">{fun}</span>;
                                  }
                                })}
                          </div>
                        </div>
                        {/* Expected Completion Date */}
                        <span>
                          Expected:{" "}
                          {new Date(
                            item.CompletionDetails?.date
                          ).toDateString()}{" "}
                          ({item.CompletionDetails?.startTime} -{" "}
                          {item.CompletionDetails?.endTime})
                        </span>

                        {/* Completed On */}
                        {item.status === Status.Completed && (
                          <span>Completed On: {item?.updatedAt}</span>
                        )}

                        {/* Form Details */}
                        <div className="flex items-center">
                          <Label htmlFor="formDetails">Your Details</Label>
                          
                            
                              
                                <div className="flex flex-col gap-1">
                                  
                                    <Button
                                      key={idx}
                                      id="formDetails"
                                      variant="link"
                                      className="text-chart-1 ml-2"
                                    >
                                      <a
                                        className=" text-blue-500 "
                                        href={item.formDetails}
                                      >
                                        <div className="flex flex-row gap-1">
                                          <File />
                                          PDF
                                        </div>
                                      </a>
                                    </Button>
                                  
                                </div>
                              
                            
                          
                        </div>
                        {!item.paymentStatus ? (
                          "You will be able to see the response when service is done after payment made"
                        ) : item?.paymentStatus ===
                          PaymentStatus.Paid ? (
                          <div className="flex flex-row gap-2">
                            <Label htmlFor="formdetails">Response</Label>
                            <Button
                              key={idx}
                              id="formDetails"
                              variant="link"
                              className="text-chart-1 ml-2"
                            >
                              <a
                                className=" text-blue-500 "
                                href={item.taskCompletion.response_receipt}
                              >
                                <div className="flex flex-row gap-1">
                                  <File />
                                  PDF
                                </div>
                              </a>
                            </Button>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="flex flex-row gap-2">
                          <span>Amount</span>
                          <span>{Number(item.ServiceDetails.price) || "You will be notified"}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                            item.status === Status.Pending
                              ? "bg-yellow-400 text-gray-800"
                              : item.status === Status.Ongoing
                              ? "bg-chart-1 text-white"
                              : item.status === Status.Completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {item?.status === Status.Pending ? (
                            <Clock />
                          ) : item?.status === Status.Ongoing ? (
                            <Laptop />
                          ) : item?.status === Status.Completed ? (
                            <CheckCircle />
                          ) : (
                            <RefreshCcw />
                          )}
                          <span>{item?.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="flex justify-between items-center">
                    {item.status === Status.Completed ? (
                      <Payment
                        status={item.status}
                        requestId={item._id}
                        amount={Number(item.ServiceDetails.price)}
                        serviceName={item.ServiceDetails?.name}
                        createdAt={new Date(item.createdAt).toDateString()}
                      />
                    ) : (
                      <span className="flex flex-row gap-1 items-center">
                        <Button disabled={true}>Pay Now</Button>
                        <p className="text-sm">wait till service not done</p>
                      </span>
                    )}
                    {item.paymentStatus ===
                    PaymentStatus.Paid ? (
                      <Button>Clear PDFs</Button>
                    ) : (
                      <Badge className="bg-red-500 text-white border border-dashed">
                        Unpaid
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
        </div>
      </ScrollArea>
      <Button variant="outline" className="border w-fit border-chart-1 ">
        Show More
      </Button>
    </div>
  );
}
export default ServiceRequests;
