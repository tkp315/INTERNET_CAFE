"use client";
import { ThemeChanger } from "@/components/ThemeChanger";
import Link from "next/link";
import React, { useState } from "react";
import { Home, LayoutDashboard, Settings, Info, Mail } from "lucide-react";

import { usePathname } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import DropDown from "./DropDown";
import { useSession } from "next-auth/react";
import { ADMIN } from "@/lib/constants";
import NotificationTray from "./notification-tray";

const items = [
  {
    title: "Home",
    url: "/",
    icon: <Home className="w-5 h-5" />, // Add the Home icon
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />, // Add the Dashboard icon
  },
  {
    title: "Services",
    url: "/client/services",
    icon: <Settings className="w-5 h-5" />, // Add the Settings icon
  },
  {
    title: "About",
    url: "/about",
    icon: <Info className="w-5 h-5" />, // Add the Info icon
  },
  {
    title: "Contact",
    url: "/contact",
    icon: <Mail className="w-5 h-5" />, // Add the Mail icon
  },
];

function Navbar({ children }: any) {
  const isMobile = useIsMobile(); // Use the `useMobile` hook
  const currentPathRoute = usePathname();
  const { data: session, status } = useSession();
  console.log(isMobile);

  return (
    <div>
      {/* Desktop UI */}
      {!isMobile && (
        <div className="lg:flex lg:flex-row lg:bg-primary-foreground
        w-screen
        lg:justify-between lg:items-center lg:shadow-md lg:shadow-chart-1 py-2 px-4 lg:overflow-x-hidden">
          {/* Left: Logo */}
          <div>
            <h1 className="font-semibold text-2xl">IC</h1>
          </div>

          {/* Navigation links */}
          <div className="hidden lg:flex lg:flex-row lg:gap-3">
            {items.map((item, key) => (
              <Link
                href={item.url}
                className={`flex  flex-col lg:flex-row lg:gap-3 lg:items-center hover:cursor-pointer hover:text-chart-3 hover:underline  ${
                  currentPathRoute === item.url ? ` underline text-chart-1` : ``
                }`}
                key={key}
              >
                {session?.role !== ADMIN && item.title === "Dashboard"
                  ? ""
                  : item.title}
              </Link>
            ))}
          </div>

          {/* Right: Theme changer & Profile Dropdown */}
          <div className="hidden lg:flex flex-row gap-6 items-center">
            <NotificationTray />
            <ThemeChanger />
            <DropDown />
          </div>
        </div>
      )}

      {/* Mobile UI */}
      {isMobile && (
        <div>
          <div className="flex flex-row justify-between py-2 px-2 shadow-md shadow-chart-1 items-center w-full">
            <h1 className="text-foreground font-semibold italic">
              Lokesh Internet Shop
            </h1>

            <div className="flex flex-row gap-2 items-center">
              <NotificationTray />
              <ThemeChanger />
              <DropDown />
            </div>
          </div>

          <div className="fixed overflow bottom-0 left-0 w-full bg-primary-foreground  py-2 z-50 ">
            <div className="flex justify-around px-2 shadow-top shadow-chart-1 py-2 ">
              <div className="flex flex-row gap-3">
                {items.map((item, key) => (
                  <Link
                    href={item.url}
                    className={`flex flex-col lg:flex-row lg:gap-3 lg:items-center hover:cursor-pointer hover:text-chart-3  ${
                      currentPathRoute === item.url
                        ? ` underline text-chart-1`
                        : ``
                    }`}
                    key={key}
                  >
                    {session?.role !== ADMIN && item.title === "Dashboard" ? (
                      ""
                    ) : (
                      <div className="flex flex-col gap-2 items-center">
                        {item.title}
                        {item.icon}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export default Navbar;
