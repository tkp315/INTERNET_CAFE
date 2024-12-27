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
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus, Status } from "@/types/models.types";
import { MdOutlineCallMissedOutgoing, MdPending } from "react-icons/md";
import { TicketX } from "lucide-react";
import { FaRandom } from "react-icons/fa";
import { Laptop } from "lucide-react"; // Ongoing
import { Clock } from "lucide-react"; // Pending
import { CheckCircle } from "lucide-react"; // Completed
import { RefreshCcw } from "lucide-react"; // Default or random
import Navbar from "@/app/Home/components/Navbar";
import Link from "next/link";
import Payment from "../components/payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomService from "../components/customServices";
import ServiceRequests from "../components/request";
import { useDispatch } from "react-redux";
import {
  OrderFilteration,
  updateCustomOrder,
  updateServiceOrder,
} from "@/app/redux/slices/filteration.slice";

function Page() {
  const dispatch = useDispatch();
  const [filterOptions1, setFilterOptions1] = useState<OrderFilteration>({
    page:1
  }); //custom
  const [filterOptions2, setFilterOptions2] = useState<OrderFilteration>({
    page:1
  }); // default
  const [tabValue, setTabValue] = useState("customRequests");

  useEffect(() => {
    dispatch(updateCustomOrder(filterOptions1));
  }, [filterOptions1]);

  useEffect(() => {
    dispatch(updateServiceOrder(filterOptions2));
  }, [filterOptions2]);

  function getFilterData(key: string, value: boolean) {
    console.log(key)
    if (tabValue === "customRequests") {
      setFilterOptions1({ ...filterOptions1, [key.toLowerCase()]: value });
    } else {
      setFilterOptions2({ ...filterOptions1, [key.toLowerCase()]: value });
    }
  }
  return (
    <Navbar>
      <div className="flex flex-row justify-around min-w-fit  items-start mt-4 mb-2">
        <Command className="rounded-lg border shadow-md w-fit px-10">
          <CommandList>
            <Label className="mt-3">Filters</Label>
            <CommandGroup heading="SERVICE STATUS">
              {Object.entries(SERVICE_STATUS).map(([key, value]) => (
                <CommandItem key={key}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        tabValue === "customRequests"
                          ? filterOptions1?.[key.toLowerCase()] || false
                          : filterOptions2?.[key.toLowerCase()] || false
                      }
                      onCheckedChange={(check) =>
                        getFilterData(key, check as boolean)
                      }
                      id={key}
                    />
                    <label
                      htmlFor={key}
                      className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {value}
                    </label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Tabs defaultValue="customRequests" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              onClick={() => setTabValue("customRequests")}
              value="customRequests"
            >
              Custom Request
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTabValue("serviceRequests")}
              value="serviceRequests"
            >
              Service Request
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customRequests">
            <CustomService />
          </TabsContent>
          <TabsContent value="serviceRequests">
            <ServiceRequests />
          </TabsContent>
        </Tabs>
      </div>
    </Navbar>
  );
}
export default Page;
