import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

interface NotificationButtonsProp{
  clientId:string,
  requestId:string
}
const buttons = [
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\order-confirmation\route.ts
  {
  title:'Request Confirmation',
  url:'/api/admin/notification-service-life/order-confirmation'
},
{
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\order-completion
  title:'Request Completion',
  url:'/api/admin/notification-service-life/order-completion'
},
{
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\payment-request
  title:'Payment Request',
  url:'/api/admin/notification-service-life/payment-request'
},
{
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\payment-confirmation
  title:'Payment Confirmation',
  url:'/api/admin/notification-service-life/payment-confirmation'
},
{
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\order-info-deletion
  title:'Information Deletion',
  url:'/api/admin/notification-service-life/order-info-deletion'
},
{
  // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\api\admin\notification-service-life\payment-request
  title:'Send Reciept',
  url:'/api/admin/notification-service-life/payment-request'
}

]
function NotificationButtons({clientId,requestId}:NotificationButtonsProp) {
  async function handleNotification(url:string){
    const res = axios.post(url,{clientId,requestId})
    console.log(res);
  }
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Send</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit ">
        <DropdownMenuLabel>Send Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea className=" h-[calc(100vh-400px)] ">
        <div className="flex flex-col gap-3">
        {
          buttons.map((btn)=>(
          <Button variant="outline" className="">
            {btn.title}
          </Button>
          ))
        }
        </div>
        </ScrollArea>
        </DropdownMenuGroup>
      

      

      
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationButtons
