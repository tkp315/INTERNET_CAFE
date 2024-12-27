/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ServiceContent {
  name: string;
  price: string;
  isAvailable: boolean;
  thumbnail: string;
  _id:string
}

interface ServiceCardProp {
  service: ServiceContent;
  query?:string
}

function ServiceCard({ service,query }: ServiceCardProp) {
  const isMobile = useIsMobile();
  function highlightquery(){
    if(query){
      const isQuery = (service.name.includes(query))?true:false;
      if(isQuery){
       const parts= service.name.replace(new RegExp(`${query}`,'i'),(match)=>{
          return `<span className=" text-chart-1">${match}</span>`;
        })
        console.log(parts)
      }
    }
    return service.name
  }
 
  return (
    <Card className={` ${isMobile? `min-w-fit`:`w-[220px]`} rounded-lg shadow-md cursor-pointer hover:shadow-chart-1 border hover:shadow-lg transition-shadow`}>
      <CardHeader className="p-0">
        <img
          src={service.thumbnail || "https://www.photoreview.com.au/wp-content/uploads/images/media/images2014/tx650_7mb/2267217-1-eng-GB/tx650_7mb_web640.jpg"}
          alt={service.name}
          className="rounded-t-lg h-[140px] w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className={`text-base font-semibold  capitalize text-card-foreground
        `}>
          {highlightquery()}
        </CardTitle>
         
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <Badge
            variant={service.isAvailable ? "default" : "destructive"}
            className="text-xs capitalize"
          >
            {service.isAvailable ? "Available" : "Unavailable"}
          </Badge>
          <p className="text-sm font-medium text-primary">${Number(service.price)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/client/services/${service._id}/function`}>
        <Button variant="outline" className="w-full">
          Go To
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
