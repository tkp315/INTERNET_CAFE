"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import useApiToast from "@/hooks/useApiToast"
import { Status } from "@/types/models.types"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
interface PaymentProp{
    status:string,
    amount:number,
    requestId:string,
    serviceName:string,
    createdAt:string,
    orderUrl:string,
    verificationUrl:string
}

function Payment({status,amount,requestId,serviceName,createdAt,orderUrl,verificationUrl}:PaymentProp) {
const [res,setRes] = useState();
const {data:session} = useSession();
const apiCall= useApiToast();


   const initiatePayment = async()=>{
    const res = await axios.post(orderUrl,{
        requestId,amount:amount,serviceName,createdAt,clientName:session?.user?.name
    })
    console.log(res);
    setRes(res.data.data)
    const result = res.data.data;




    if(typeof window==='undefined')return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';


    script.onload=()=>{
        const options = {
          key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount:result.amount||100,
          currency:"INR",
          name:"Lokesh Internet Shop",
          description:"Test Transaction",
          order_id:result.id,
          // callback_url:`http://localhost:3000/client/${requestId}/payment-verification`,
          prefill: {
            name: "", // Customer's name
            email: "gaurav.kumar@example.com", // Customer's email
            contact: "9000090000", // Customer's phone number
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc", // Theme color for Razorpay modal
          },

          handler: async (response: any) => {
            
            console.log("Razorpay Payment Response:", response);

            
            const verificationResponse = await apiCall(verificationUrl, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },axios.post);

            console.log("Payment Verification Response:", verificationResponse.data);

            // Handle payment verification success or failure
            if (verificationResponse.success) {
              alert("Payment Successful!");
            } else {
              alert("Payment Verification Failed!");
            }
          },
        };


        const razorpay = new window.Razorpay(options)
        razorpay.open();
    }
       document.body.appendChild(script);
   }
   console.log(res)

  return (<div>
 <Button onClick={initiatePayment} >Pay Now</Button>
 {status===Status.Completed ? (
    ""
 ):(
    <Dialog>
        <DialogContent>
            Your Application Not Completed
        </DialogContent>
    </Dialog>
 )}
  </div>
  
   
  )
}

export default Payment
