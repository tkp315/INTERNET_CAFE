/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import React from "react";

function ServiceCard() {
  return (
    <div className="flex flex-col border bg-card border-border w-[200px] px-2 py-2 gap-1 rounded-md">
      {/* 
        1.Name
        2.thumbnail
        3. description
        4. price */}
      <div>Service Name</div>
      <div className=" ">
        <div className="flex flex-col gap-2">
          <img
            className="w-full"
            src="https://www.photoreview.com.au/wp-content/uploads/images/media/images2014/tx650_7mb/2267217-1-eng-GB/tx650_7mb_web640.jpg"
            alt="nothing"
          ></img>
          <div>
            <p className="text-secondary-foreground">Description</p>
            <div className="flex flex-row justify-between items-center">
              <p>30 Rs</p>
              <Button>Go To</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
