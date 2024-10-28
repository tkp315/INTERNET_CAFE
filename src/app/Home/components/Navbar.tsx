"use client"
import { ThemeChanger } from '@/components/ThemeChanger'
import { Toggle } from '@/components/ui/toggle'
import Link from 'next/link'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { CgProfile } from "react-icons/cg"
import { VscRequestChanges } from "react-icons/vsc"
import { MdOutlinePendingActions, MdOutlineLanguage, MdLogout, MdAccountCircle, MdMenu, MdClose } from "react-icons/md"

function Navbar({ children }: any) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
   <div>
     <div className='flex flex-row bg-primary-foreground w-full justify-between items-center shadow-md shadow-chart-1 py-2 px-8 sm:px-8'>
      {/* Left: Logo */}
      <div>
        <h1 className='font-semibold text-2xl'>IC</h1>
      </div>

      {/* Mobile Menu Icon: Shown on small screens, hidden on large */}
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
          {menuOpen ? <MdClose className="text-3xl" /> : <MdMenu className="text-3xl" />}
        </button>
      </div>

     
      <div className={`flex flex-col lg:flex-row lg:gap-3 absolute lg:static lg:flex visible lg:visible transition-all duration-300 ease-in-out ${menuOpen ? 'top-16 left-0 w-full bg-primary-foreground p-4' : 'hidden lg:flex'}`}>
        <Toggle aria-label="Toggle italic"><Link href="/" className='hover:text-blue-600 hover:underline'>Home</Link></Toggle>
        <Toggle aria-label="Toggle italic"><Link href="/services" className='hover:text-blue-600 hover:underline'>Services</Link></Toggle>
        <Toggle aria-label="Toggle italic"><Link href="/about" className='hover:text-blue-600 hover:underline'>About</Link></Toggle>
        <Toggle aria-label="Toggle italic"><Link href="/contact-us" className='hover:text-blue-600 hover:underline'>Contact</Link></Toggle>
      </div>

      {/* Right: Theme changer & Profile Dropdown */}
      <div className='hidden lg:flex flex-row gap-6 items-center'>
        <ThemeChanger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MdAccountCircle className='text-xl' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='flex gap-2 cursor-pointer'>
                <CgProfile />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-2 cursor-pointer'>
                <VscRequestChanges />
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-2 cursor-pointer'>
                <MdOutlinePendingActions />
                Cart
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className='flex gap-2 cursor-pointer'>
                <MdOutlineLanguage />
                Language
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <Button variant="destructive" className='w-full cursor-pointer flex gap-2'>
              <MdLogout />
              Log out
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    {children}
   </div>
  )
}

export default Navbar
