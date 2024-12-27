"use client";
import {
  section1_left,
  section1_btn,
  section2_left,
  section2_right,
  section3_left,
  section3_right,
  section4_up,
  section5_up,
} from "@/utilities/data/home";
import Navbar from "./Home/components/Navbar";
import Section from "./Home/components/Section";
import { ScrollArea } from "@/components/ui/scroll-area";
import FooterSection from "./Home/components/FooterSection";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { requestNotificationPermission } from "@/lib/firebase-token";
import { ADMIN } from "@/lib/constants";
import { messaging } from "@/lib/firebase";
import firebase from "firebase/messaging";
import { useFcmToken } from "@/hooks/useFcmToken";
import UnskipableDialog from "./Home/components/unskipable-dialog";
import { useDispatch } from "react-redux";
import { unskippableDialogType, updateDialog } from "./redux/slices/filteration.slice";
import { useSelector } from "react-redux";
import useApiToast from "@/hooks/useApiToast";
import axios from "axios";

export default function Home() {
  // session
  const { data: session, status } = useSession();


  // useEffect(() => {
  //   if (status === "authenticated" && session?.role && !permissionRequested) {
  //     requestNotificationPermission(session.role);
  //     setPermissionRequested(true)
  //   }
  // }, [status, session]);
  const { token} = useFcmToken(); // Call the hook here

  useEffect(() => {
    if (session?.role === "ADMIN") {
      console.log("FCM Token for Admin:", token);
    }
  }, [session?.role, token]);
  const apiCall = useApiToast()
  async function checkTheLength(){
    // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\client\payment\fetch-all-payment-orders\route.ts
    const url = '/api/client/payment/fetch-all-payment-orders';
    const res = await apiCall(url,null,axios.get)
    if(res.statusCode===200 && res.success===true){
      const length = res.data.length;
      dispatch(updateDialog({length,isOpen:true,isAllPaid:false}))
    }
    
  }
  useEffect(()=>{
    checkTheLength()
  },[])
   const dispatch = useDispatch();
   const openParam:unskippableDialogType = useSelector((state)=>state.filter).unskippableDialog
   const isOpen = openParam.isOpen
  return (
    <Navbar>
      {isOpen?
   
        
        <UnskipableDialog/>
      :""
        }
      <ScrollArea className="h-full ">
        <div className=" flex flex-col gap-2">
          <Section
            left={section1_left}
            right={section1_btn}
            isButtons={true}
            direction={true}
          />
          <Section
            left={section2_right}
            right={section2_left}
            isButtons={false}
            direction={false}
          />
          <Section
            left={section3_left}
            right={section3_right}
            isButtons={false}
            direction={true}
          />
          <div className="flex-row flex gap-2 items-center">
            <FooterSection
              inputData={section4_up}
              btn="Try it out"
            ></FooterSection>
            <FooterSection inputData={section5_up} btn="Demo" />
          </div>
        </div>
      </ScrollArea>
    </Navbar>
  );
}
