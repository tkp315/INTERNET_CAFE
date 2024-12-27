
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

import useApiToast from "@/hooks/useApiToast";
import axios from "axios";
import { useSession } from "next-auth/react";
import {  useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell } from "lucide-react";

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
function NotificationTray() {
  const apiCall = useApiToast();
  const isMobile = useIsMobile()
  const [result, setResult] = useState([]);
  async function fetchNotifications() {
 
    const url = "/api/client/notification/fetch";
    const res = await apiCall(url, null, axios.get);
    console.log(res);
  if(res && res.statusCode===200){
    setResult(res.data);
  }
  }
//   useEffect(() => {
//     fetchNotifications();
//   }, []);
  const { data: session } = useSession();
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
        <Button 
        onClick={fetchNotifications}
        variant="outline" size={isMobile? 'sm':'default'}>
    <Bell/>
  </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
           <div className="flex flex-col gap-2">
           <ScrollArea  className="h-[calc(100vh-100px)]">
          {result.length === 0
            ? "No Result Found"
            : result.map((notification: NotificationType, idx) => (
               
                 <Card key={idx} className={`w-fit 
                  border  ${session?._id===notification.sender._id?`bg-green-100`:`bg-yellow-100`}`} >
                  <CardHeader>
                    <CardTitle>
                      {JSON.parse(notification.message).notification.title}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-row justify-between items-center">
                        <span>
                          sent by
                          {notification.sender.name === session?.user?.name
                            ? " YOU "
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
                   
                  </CardFooter>
                </Card>
             
              ))}
  </ScrollArea>
           </div>
          
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NotificationTray;
