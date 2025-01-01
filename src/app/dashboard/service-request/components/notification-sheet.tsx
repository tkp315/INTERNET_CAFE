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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useApiToast from "@/hooks/useApiToast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NotificationButtons from "./notification-catlog";
import { ScrollArea } from "@/components/ui/scroll-area";
interface NotificationSheetProps {
  requestId: string;
  url:string
}
interface NotificationType {
  recipient: {
    name: string;
    phoneNo: string;
    _id: string;
    email: string;
  };
  message: string;
  serviceRequest: string;
  isRead: boolean;
  sender: {
    name: string;
    phoneNo: string;
    _id: string;
    email: string;
  };
  createdAt: string;
}
function NotificationSheet({ requestId,url}: NotificationSheetProps) {
  const apiCall = useApiToast();
  const [result, setResult] = useState([]);
  async function fetchNotifications() {
    // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\fetch
 
    const res = await apiCall(url, { requestId }, axios.post);
    // console.log(res);
  if(res && res.statusCode===200){
    setResult(res.data);
  }
  }
  useEffect(() => {
    fetchNotifications();
  }, []);
  const { data: session } = useSession();
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Notifications</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>All the Notifications</SheetTitle>
          </SheetHeader>

          {result.length === 0
            ? "No Result Found"
            : result.map((notification: NotificationType, idx) => (
               <ScrollArea key={idx} className="h-[calc(100vh-100px)]">
                 <Card className="w-fit  " >
                  <CardHeader>
                    <CardTitle>
                      {JSON.parse(notification.message).notification.title}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-row justify-between items-center">
                        <span>
                          sent by
                          {notification.sender.name === session?.user?.name
                            ? "YOU"
                            : notification.sender.name}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span>
                      {JSON.parse(notification.message).notification.body}
                    </span>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="">
                      {new Date(notification.createdAt).toDateString()}
                    </span>
                   <NotificationButtons clientId={(notification.sender._id===session?._id)?notification.recipient._id:notification.sender._id}
                   requestId={requestId} />
                  </CardFooter>
                </Card>
               </ScrollArea>
              ))}

          
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default NotificationSheet;
