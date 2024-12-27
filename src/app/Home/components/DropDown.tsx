"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import {
  MdAccountCircle,
  MdLogout,
  MdOutlineLanguage,
} from "react-icons/md";
import { VscRequestChanges } from "react-icons/vsc";
import { signOut } from "next-auth/react";
function DropDown() {
  const isMobile = useIsMobile();
  const{data:session,status} = useSession();

  const isLoggedIn = status==='authenticated'?true:false;

  return (
    <>
    {isLoggedIn?(<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>
          <MdAccountCircle className="text-xl" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-2 cursor-pointer">
            <CgProfile />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 cursor-pointer">
            <VscRequestChanges />
            {/* C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\client\service-request */}
            <Link href={`/client/service-request`}>Orders
            </Link>
          </DropdownMenuItem>
         
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-2 cursor-pointer">
            <MdOutlineLanguage />
            Language
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
         {
            isLoggedIn?( <Button
                variant="destructive"
                className="w-full cursor-pointer flex gap-2"
                onClick={()=>signOut()}
              >
                <MdLogout />
                Log out
              </Button>):""
         }
      </DropdownMenuContent>
    </DropdownMenu>):(
       <Link href="/sign-in">
        <Button className="" variant="default">
            Login
        </Button>
       </Link>
    )}
    </>
  );
}

export default DropDown;
