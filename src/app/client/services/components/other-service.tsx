"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Forward, Info } from "lucide-react";
import useApiToast from "@/hooks/useApiToast";
import axios from "axios";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateType {
  date: string;
  day: string;
}
interface InputType {
  date: Date;
  interval: string;
}

function OtherService() {
  const [serviceDetails, setServiceDetails] = useState("");
  const [files, setFiles] = useState([]);
  const isMobile = useIsMobile();
  const apiCall = useApiToast();
  async function handleSave() {
    if (!serviceDetails || !files) {
      console.log("ServiceDetails or Files not found");
      return;
    }
    const formData = new FormData();
    formData.append("serviceDetails", serviceDetails);
    for (const i of files) {
      formData.append("files", i);
    }
    formData.append("date", inputData.date.toString());
    formData.append("interval", inputData.interval);
    const url = `/api/admin/other-services/create-service`;
    const res = await apiCall(url, formData, axios.post);
    console.log(res);
  }
  function handleFileInput(e) {
    console.log(e.target.files);
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    setFiles(uploadedFiles);
  }
  function handleInput(e) {
    const { value } = e.target;
    setServiceDetails(value);
  }
  // ********** Availibility **************

  const [inputData, setInputData] = useState<InputType>({
    date: new Date(),
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
  return (
    <Card
      className={` ${
        isMobile ? `min-w-fit` : `w-[220px] h-fit`
      } rounded-lg shadow-md cursor-pointer hover:shadow-chart-1 border hover:shadow-lg transition-shadow bg-blue-300`}
    >
      <CardHeader className="p-0">
        <img
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/018/869/765/small/male-customer-support-png.png"
          }
          alt="Other Service"
          className="rounded-t-lg h-[140px] w-full object-cover bg-blue-400 text-blue-300"
          // width={100}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle
          className={`text-base font-semibold  capitalize text-card-foreground
      `}
        >
          Your Service
        </CardTitle>
        <CardDescription>Tell Us what you want to do</CardDescription>
        <Separator className="my-2" />
      </CardContent>
      <CardFooter className="p-4">
        <Dialog>
          <DialogTrigger>
            <Button>Fill Details</Button>
          </DialogTrigger>
          <DialogContent className="w-fit justify-center flex items-center">
            <Card className="w-fit ">
              <CardHeader>
                <CardTitle className="text-center text-base font-medium text-gray-800">
                  Provide Details Below
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="service-details">Service Description</Label>
                    <Textarea
                      id="service-details"
                      name="serviceDetails"
                      placeholder="Describe the service you need..."
                      // value={serviceDetails}
                      onChange={handleInput}
                    />
                  </div>

                  <Separator />

                  {/* File input */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="file-upload">
                      Upload Related Files (all formats accepted)
                    </Label>
                    <Input
                      multiple
                      accept=".pdf"
                      id="file-upload"
                      type="file"
                      name="file"
                      onChange={handleFileInput}
                    />
                  </div>
                </div>
              </CardContent>

              <Separator />
              <CardTitle className="px-4 mt-3 mb-4 flex items-center gap-2 text-accent-foreground">
                <Info size={20} /> Available Timings
              </CardTitle>
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
                            <SelectItem
                              key={index}
                              value={`${i.start}-${i.end}`}
                            >
                              {i.start}-{i.end}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-end gap-4">
                <Button className="mt-2" onClick={handleSave}>
                  Proceed <Forward />
                </Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default OtherService;
