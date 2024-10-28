"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios"

function Page() {
  const [state,setState]=useState({
    serviceCategoryName:"", 
    description :""
  })

async function submit (){
    const res = await axios.post("/api/admin/add-category",{serviceCategoryName:state.serviceCategoryName,description:state.description});
    console.log(res)
}
  const handleInputChange = (e)=>{
    const {name,value} = e.target;
    setState({
      ...state,
      [name]:value
    })
    console.log(`${name}:${value}`)
  }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-3 w-fit border border-chart-1 justify-center items-center">
      <Input
       onChange={handleInputChange}
       name="serviceCategoryName"
       placeholder="category"
      ></Input>
      <Input
       onChange={handleInputChange}
       name="description"
       placeholder="description"
      ></Input>
      <Button 
      onClick={submit}
      >
        Add
      </Button>
    </div>
    </div>
  )
}

export default Page
