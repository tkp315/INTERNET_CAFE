"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {FiLoader} from 'react-icons/fi'
import { useRouter } from "next/navigation";


const emailSchema = z.string().email({ message: "Invalid email Address" });

function Page() {
  const [email, setEmail] = useState<string>("");
  const [errors,setErrors]=useState("");
  const [isSubmmiting,setIsSubmmiting]=useState(false);
  const router =useRouter();
  

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmmiting(true)
  const parsedData = emailSchema.safeParse(email);
   if(!parsedData.success){
    // setErrors(parsedData)
    console.log(parsedData.error)
   setErrors(parsedData.error.format()._errors[0])
   return ;
   }
      const res = await axios.post("/api/verify-email", { email });
      console.log(res)
      toast({
        title: res?.data?.success ? "Success" : "Failed",
        description: res?.data?.message,
        variant:"default"
        
      });
      if(res.data.success){
        router.push("/sign-up")
      }
    } catch (error) {
      console.log("Error occuring while sending", error);

      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "An error occured"
          : "Error Not Found";

      toast({
        title: "OTP SENT FAILED",
        description: errorMessage,
        variant: "destructive",
      });
    } finally{
      setIsSubmmiting(false)
    }
  }

  return (
    <div className=" flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter email</CardTitle>
          <CardDescription>Make sure to enter correct email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <div className=" text-red-500">
                {errors}
              </div>
              <Button variant="default" className="bg-ring" disabled={isSubmmiting} type="submit">
                {
                  isSubmmiting?<>
                  <FiLoader className=" animate-spin"/>
                  Sending..
                  </>:
                  <>Send OTP</>
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
