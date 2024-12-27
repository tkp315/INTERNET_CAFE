import { Computer, User2, Bell, Grid, Inbox, Settings, User, ChevronUp,LayoutDashboard, ExternalLinkIcon, LogOut, CheckCircle, Package } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";

// Menu items: "Users," "Services," "Categories," "Requests," and "Notifications."
const items = [
  {
    title: "DASHBOARD",
    url: "/dashboard",
    icon:LayoutDashboard ,
  },
  {
    title: "CLIENTS",
    url: "/dashboard/clients",
    icon: User,
  },
  {
    title: "SERVICES",
    url: "/dashboard/services",
    icon: Settings,
  },
  {
    title: "CATEGORIES",
    url: "/dashboard/category",
    icon: Grid,
  },
  {
    title: "CUSTOM  SERVICE ",
    url: "/dashboard/custom-services",
    icon: Package,
  },
  {
    title: "REQUESTS",
    url: "/dashboard/service-request",
    icon: Inbox,
  },
  
  {
    title: "COMPLETION",
    url: "/dashboard/completion",
    icon: CheckCircle,
  },
 
];

export function AppSidebar() {
  const currentPathRoute = usePathname();

  return (
    <div className="flex flex-row items-start ">
      <Sidebar variant="sidebar" collapsible="icon" className=" ">
        {/* Header */}
        
        <SidebarHeader>
                    <SidebarMenuButton
                      asChild
                      className={` flex items-center gap-2 p-2 rounded-md`}
                    >
                     <span className=""> <Computer className="text-4xl"/> NetCafe
                     </span>
                    </SidebarMenuButton>
                  </SidebarHeader>
       

        {/* Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        currentPathRoute === item.url ? "bg-chart-1 hover:bg-chart-1" : ""
                      } flex items-center gap-2 p-2 rounded-md`}
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter >
       <SidebarMenu>
        <SidebarMenuItem>
         
          <Link href="/">
          <SidebarMenuButton variant="outline">
          <LogOut size={14} className="mr-2"/>
          Exit
          </SidebarMenuButton>
        </Link>
        
        </SidebarMenuItem>
       </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger  />
    </div>
  );
}
