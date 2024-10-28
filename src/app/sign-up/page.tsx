"use client"
import {  z } from "zod"
import { signupSchema } from "../schemas/userSchema"
import {  FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FiLoader } from "react-icons/fi";
import { FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signupData } from "@/utilities/data/user.data";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SignUp = z.infer<typeof signupSchema>;

function Page() {

    const form = useForm<SignUp>({
       defaultValues:{
        name:"",
        email:"",
        phoneNo:"",
        otp:"",
        password:"",
        confirmPassword:""
       },
       resolver: zodResolver(signupSchema)
    })

    const {formState:{errors}} = form;
    const [isSubmitting,setIsSubmitting] =useState(false);
    const router=useRouter()
    
    const  onSubmit:SubmitHandler<SignUp>=async(data)=>{
    
     console.log(data)
     try {
        setIsSubmitting(true)
        const res = await axios.post("/api/sign-up",data);
        console.log(res);
        toast({
            title:res?.data?.success?"Success":"Failed",
            description:res?.data?.message||"user successfully created",
            duration: 5000,
            variant:"default"
        })
        if(res.data.success){
            router.push("/sign-in")
        }
     } catch (error) {
        const errMessage = axios.isAxiosError(error) && error.response?
        error.response.data?.message || "An Error Occured" : "Message Not Found";
         
        toast({
            title:"Failed",
            description:errMessage,
            variant:"destructive"
        })
        
     }
     finally{
        setIsSubmitting(false)
     }
    }


  return (
    <div className=" flex min-h-screen justify-center items-center">
      <Card className="max-w-lg mx-auto mt-8 border border-ring mb-2">
      <CardHeader>
        <CardTitle>Signup Form </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-3 flex flex-col gap-4"
          >
          <div className=" flex flex-row justify-center gap-4">
          <div className=" flex flex-col gap-3">
            {
            signupData.slice(0,3).map((item,idx) => (
              <FormField
                key={idx}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {item.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        type={item.type}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs">
                    {errors[item.name]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))
            }
            
            </div>
            <div className=" flex flex-col gap-3">
            {
            signupData.slice(3,6).map((item,idx) => (
              <FormField
                key={idx}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {item.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        type={item.type}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs">
                    {errors[item.name]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))
            }
            </div>
          </div>
          <div className=" ">
          Already have an account ? 
          <Button variant="link">
          <Link href="/sign-in" className="text-blue-400">
            Login
          </Link>
          </Button>
         </div>
              <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Save"
          )}
        </Button>
         
          </form>
        </FormProvider>
      </CardContent>
     
    </Card>
    </div>
  )
}

export default Page
