import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface NotificationButtonsProp<CustomeServiceTable> {
  clientId: string;
  requestId: string;
  row: Row<CustomeServiceTable>;
}
interface Button {
  title: string;
  forwardLink?:string
  MESSAGE_DATA: MESSAGE_DATA_TYPE;
}
import { MESSAGE_DATA_TYPE } from "@/app/api/admin/other-services/notification/route";
import { Row } from "@tanstack/react-table";
import { CustomeServiceTable } from "../utils/custom-service-table";
import useApiToast from "@/hooks/useApiToast";

function NotificationButtons({
  clientId,
  requestId,
  row,
}: NotificationButtonsProp<CustomeServiceTable>) {
  const buttons: Button[] = [
    {
      title: "Request Confirmation",
      MESSAGE_DATA: {
        title: "SERVICE REQUEST CONFIRMATION",
        message: `Hello ${row.original.clientName}, your request for ${
          row.original.name
        } services have been accepted on ${new Date().toDateString()}.`,
      },
    },
    {
      title: "Request Completion",

      MESSAGE_DATA: {
        title: "SERVICE REQUEST COMPLETION",
        message: `Hello ${row.original.clientName}, your request for ${
          row.original.name
        } services have been accepted on ${new Date().toDateString()}.`,
      },
    },
    ,
    {
      title: "Payment Request",

      MESSAGE_DATA: {
        title: "PAYMENT REMINDER",
        message: `Hello ${
          row.original.clientName
        }, your Work Completed  on ${new Date().toDateString()}.PAY the service amount and take the receipt `,
      },
    },
    {
      title: "Payment Confirmation",

      MESSAGE_DATA: {
        title: "PAYMENT CONFIRMATION",
        message: `Thanks ${
          row.original.clientName
        },successfully got payment on ${new Date().toDateString()}.`,
      },
    },
    {
      title: "Information Deletion",

      MESSAGE_DATA: {
        title: "SERVICE REQUEST CONFIRMATION",
        message: `Hello ${
          row.original.clientName
        }, your all the information for ${
          row.original.name
        } services has been deleted on ${new Date().toDateString()}.`,
      },
    },
    {
      MESSAGE_DATA: {
        title: "SERVICE RECIEPT DATA",
        message: `Hello ${
          row.original.clientName
        }, your all the information for ${
          row.original.name
        } services has been deleted on ${new Date().toDateString()}.`,
      },
      title: "Send Reciept",
    },
  ];
//   C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\other-services\notification
  const url = `/api/admin/other-services/notification`
  const apiCall = useApiToast();
  async function handleNotification(MESSAGE_DATA:MESSAGE_DATA_TYPE,link:string|"") {
    // const res = axios.post(url, {MESSAGE_DATA, clientId, requestId,link });
    const res = await apiCall(url,{MESSAGE_DATA, clientId, requestId,link },axios.post)
    console.log(res);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Send</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit ">
        <DropdownMenuLabel>Send Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea className=" h-[calc(100vh-400px)] ">
            <div className="flex flex-col gap-3">
              {buttons.map((btn) => (
                <Button
                onClick={()=>handleNotification(btn.MESSAGE_DATA,btn.forwardLink||"")}
                 variant="outline" className="">
                  {btn.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationButtons;
