"use client";
import Navbar from "@/app/Home/components/Navbar";
import { selectedServiceData } from "@/app/redux/slices/services.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDone, MdSummarize } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { date } from "zod";
interface DateType {
  date: string;
  day: string;
}
interface InputType {
  date: Date ;
interval: string ;
}
function Page() {
  const serviceDetails = useSelector((state) => state.services);
  const service = serviceDetails.selectedService;
  const processingData = serviceDetails.processingServiceData;
  const serviceName = service.serviceName;
  const [inputData, setInputData] = useState<InputType>({
    date:new Date(),
    interval: "",
  });
  const [dates, setDates] = useState<DateType[]>();
  function getNext7DatesAndDays() {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = currentDate.toLocaleString("en-Us", { weekday: "long" });

      const dateString = currentDate.toISOString().split("T")[0];
      dates.push({ date: dateString, day: dayName });
    }
    setDates(dates);
  }
  const [interval, setInterval] = useState([
    { start: `12:00 PM`, end: `1:00 PM` },
    { start: `1:00 PM`, end: `2:00 PM` },
    { start: `4:00 PM`, end: `5:00 PM` },
    { start: `5:00 PM`, end: `6:00 PM` },
  ]);
  useEffect(() => {
    getNext7DatesAndDays();
  }, []);
  function handleDateChange(val: string) {
    const convertToDate = new Date(val);

    setInputData({ ...inputData, date: convertToDate });
  }
  function handleIntervalChange(val: string) {
    setInputData({ ...inputData, interval: val });
  }
  console.log(processingData);
 const dispatch = useDispatch()
 const navigate = useRouter();
  async function handleSubmition() {
    const res = await axios.post(`/api/admin/service-requested/availability`, {
      interval: inputData.interval,
      date: inputData.date,
    });
    console.log(res.data.data);
    if(res.data.statusCode===200){
    dispatch(selectedServiceData({...serviceDetails.processingServiceData,availability:res.data.data}))
     navigate.push(`/client/service-request/${service._id}/order-summary`);
    }

  }
  return (
    <Navbar>
      <div className="flex flex-col items-center mx-4 mt-6 gap-6">
        {/* Service Info */}
        <Card className="w-full max-w-xl  hover:shadow-xl hover:shadow-chart-1">
          <CardHeader>
            <CardTitle className="text-center text-lg md:text-xl font-semibold text-secondary-foreground">
              Selected Service: {serviceName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Please choose the Time you’d like us to perform for this service.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-xl hover:shadow-xl hover:shadow-chart-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent-foreground">
              <Info size={20} /> Available Timings
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex flex-col gap-4 mt-6 mb-2">
              <div className="grid grid-cols-3 items-center">
                <Label>Select Day</Label>
                <Select onValueChange={handleDateChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Days</SelectLabel>
                      {dates?.map((d, index) => (
                        <SelectItem key={index} value={`${d.date}`}>
                          {d.day}, {"   "}
                          {d.date}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 items-center">
                <Label>Select Timing</Label>
                <Select onValueChange={handleIntervalChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Time Interval</SelectLabel>
                      {interval?.map((i, index) => (
                        <SelectItem key={index} value={`${i.start}-${i.end}`}>
                          {i.start}-{i.end}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <div className="w-full max-w-xl  ">
         
            <Button
            onClick={handleSubmition}
              variant="default"
              className="w-full flex justify-center items-center gap-2 hover:shadow-md hover:shadow-chart-1 mb-3"
              //   onClick={handleProceedBTN}
              //   disabled={selectedFunctions.length === 0 && !otherFunction}
            >
              Summary <MdSummarize size={20} />
            </Button>
          
        </div>
      </div>
    </Navbar>
  );
}

export default Page;
