"use client"

import Navbar from "@/app/Home/components/Navbar"
import ServiceCategoryBox from "./components/ServiceCategoryBox"

// 1. just like pw courses 
// 2. 1)box->all-services(slider) ->4 boxes in one page (4 services on one time )
// 3. search, filter -> drawer
//3. pagination 

function Page() {
  return (
    <Navbar>
       <div className="px-10 my-3">
       <ServiceCategoryBox/>

       </div>
    </Navbar>
  )
}

export default Page
