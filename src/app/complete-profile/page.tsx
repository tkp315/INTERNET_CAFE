"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "../redux/slices/user.slice";

function Page() {
  const { data: session } = useSession();
  const router = useRouter()
  const [phone, setPhone] = useState("");
  

  async function handleSubmission() {
    const res = await axios.post("/api/user/add-phone", {
      email: session?.user?.email,
      phoneNo: phone,
    });
    console.log(res);
    if(res.data.statusCode===200){
       
        router.push('/')
    
    }
  }
  return (
    <Card className="">
      <CardTitle>PROFILE DETAILS</CardTitle>
      <CardContent>
       <div className="flex flex-col gap-2 ">
       <Label htmlFor="phone">PHONE NO</Label>
        <Input
          className=""
          type="string"
          id="phone"
          onChange={(e) => setPhone(e.target.value)}
        ></Input>
       </div>
        <Button
        onClick={handleSubmission} >
            Save
        </Button>
      </CardContent>
    </Card>
  );
}

export default Page;
