"use client";

import { ServiceType } from "@/app/dashboard/services/utils/serviceTableSchema";
import Navbar from "@/app/Home/components/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { ArrowRight, Info } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { selectedServiceData, selectedServiceFun } from "@/app/redux/slices/services.slice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";

type SelectedFun = {
  idx: number;
  fun: string;
};

function Page() {
  const [service, setService] = useState<ServiceType>();
  const [selectedFunctions, setSelectedFunctions] = useState<SelectedFun[]>([]);
  const { serviceId } = useParams();
  const [otherFunction, setOtherFunction] = useState("");
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const funArr = [...selectedFunctions.map((sf) => sf.fun), {other:otherFunction}].filter((f) => f);
  const serviceDetails = useSelector((state) => state.services);
  async function fetchService() {
    try {
      const res = await axios.get(
        `/api/client/services/fetch-by-id?serviceId=${serviceId}`
      );
      if (res.data.statusCode === 200) {
        const fetchedService = res.data.data;
        setService(fetchedService);

        const dispatchedObj = {
          forms: fetchedService.forms,
          serviceName: fetchedService.name,
          servicePrice: fetchedService.price,
          _id: fetchedService._id,
          categoryId: fetchedService.categoryId,
          categoryName: fetchedService.category,
          thumbnail:fetchedService.thumbnail||`https://as2.ftcdn.net/v2/jpg/02/16/77/57/1000_F_216775758_LNMlKozbMPM0bRaimU5OuQTrsIypcGrn.jpg`
        };

        dispatch(selectedServiceFun(dispatchedObj));
      }
    } catch (error) {
      console.error("Error fetching service:", error.message);
    }
  }
   function handleProceedBTN(){
    dispatch(selectedServiceData({...serviceDetails.processingServiceData,selectedFunctions:funArr}))
   }
  useEffect(() => {
    fetchService();
  }, []);

  // Toggle function selection
  const toggleFunction = (idx: number, fun: string) => {
    setSelectedFunctions((prev) => {
      const isFunction = prev.find((e) => e.idx === idx);
      if (isFunction) {
        return prev.filter((e) => e.idx !== idx);
      } else {
        return [...prev, { idx, fun }];
      }
    });
  };

  console.log(selectedFunctions);

  return (
    <Navbar>
      <div className={`flex flex-col ${isMobile?`min-h-fit`:``} items-center mx-4 mt-6 gap-6`}>
        {/* Service Info */}
        <Card className={`${isMobile?`h-fit`:``} w-full max-w-xl  hover:shadow-xl hover:shadow-chart-1`}>
          <CardHeader>
            <CardTitle className="text-center text-lg md:text-xl font-semibold text-secondary-foreground">
              Selected Service: {service?.name || "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Please choose the functions you’d like us to perform for this
              service.
            </p>
          </CardContent>
        </Card>

         <Card className={` ${isMobile?`h-fit`:``} w-full max-w-xl hover:shadow-xl hover:shadow-chart-1`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent-foreground">
              <Info size={20} /> Available Functions
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)] flex flex-col gap-3 ">
              <div className="flex flex-col gap-4 mt-6 mb-2">
                {service?.functions?.map((fun, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-md border hover:shadow-md"
                  >
                    <Checkbox
                      id={`function-${idx}`}
                      checked={
                        selectedFunctions.find((e) => e.idx === idx)
                          ? true
                          : false
                      }
                      onCheckedChange={() => toggleFunction(idx, fun)}
                    />
                    <Label
                      htmlFor={`function-${idx}`}
                      className="text-primary font-medium"
                    >
                      {fun}
                    </Label>
                  </div>
                ))}
                <Separator></Separator>
                <Label htmlFor="other" className=" text-lg font-semibold">
                  Specify the exact function
                </Label>
                <Textarea
                  id="other"
                  placeholder="Explain the work in detail "
                  onChange={(e) => setOtherFunction(e.target.value)}
                ></Textarea>
              </div>
              {isMobile &&(
              <div className="w-full max-w-xl  ">
       
       <Link href={`${(otherFunction && funArr.length===0 )?`/client/service-request/${service?._id}/availibility`:`/client/service-request/${service?._id}/function/fill-form`}`}>
              <Button
                variant="default"
                className="w-full flex justify-center items-center gap-2 hover:shadow-md hover:shadow-chart-1 mb-3"
                onClick={handleProceedBTN}
                disabled={selectedFunctions.length === 0 && !otherFunction}
              >
                Proceed <ArrowRight size={20} />
              </Button>
              </Link>
            </div>
            )}
            </ScrollArea>
            
          </CardContent>
        </Card>
        
        

        {/* Proceed Button */}
       {!isMobile &&( <div className="w-full max-w-xl  ">
       
        <Link href={`${(otherFunction && funArr.length===0 )?`/client/service-request/${service?._id}/availibility`:`/client/service-request/${service?._id}/function/fill-form`}`}>
       <Button
         variant="default"
         className="w-full flex justify-center items-center gap-2 hover:shadow-md hover:shadow-chart-1 mb-3"
         onClick={handleProceedBTN}
         disabled={selectedFunctions.length === 0 && !otherFunction}
       >
         Proceed <ArrowRight size={20} />
       </Button>
       </Link>
     </div>)}
      </div>
    </Navbar>
  );
}

export default Page;
