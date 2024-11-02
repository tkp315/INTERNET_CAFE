"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FieldItems {
    type:string,
    name:string,
    label:string
}
function Page() {
    const [fieldItems,setFieldItems] = useState<FieldItems>({
     type:"",
     name:"",
     label:""
    })
    const [fieldArray,setFieldArray] =useState<Array<FieldItems>>([])
    
    const handleInput=(e)=>{
        const {name,value} =e.target;
        setFieldItems({
            ...fieldItems,
            [name]:value
        })
        console.log(`${name}:${value}`)
    }
    const addingInArray=()=>{
     setFieldArray(curr=>[...curr,fieldItems])
     setFieldItems({ type: "", name: "", label: "" });
    }
    console.log(fieldArray)
  


    // serviceId

    const {params} = useParams();
    console.log(params)
    const serviceId = params?.serviceId||"6724783aa9e411e2d2dba0b4"
    async function handleSubmit(){
      const formData= new FormData();
      formData.append("serviceId",serviceId);
      fieldArray.forEach((el)=>formData.append("serviceFormField",JSON.stringify(el)));

      const res = await axios.post("/api/admin/add-services/service-forms",formData)
      console.log(res);
    }
 
  

  return (

    <Card className="sm:max-w-[425px] ">
      <CardHeader>
        <CardTitle>Add Form Fields</CardTitle>
        <CardDescription>
        This dialog allows admins to create and manage custom form fields tailored for specific services or categories 
        {/* Attach a link here for examples and more types and .. */}
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div className=' flex flex-row gap-2'>
        
        <Input
        className='border border-chart-1 border-dashed'
        placeholder='Enter Type'
        type='text'
        name='type'
        onChange={handleInput}
        value={fieldItems.type}>
        
        </Input>
  
        <Input
        className='border border-chart-1 border-dashed'
        placeholder='Enter Label'
        type='text'
        name='label'
        onChange={handleInput}
        value={fieldItems.label}>
        </Input>
  
        <Input
        className='border border-chart-1 border-dashed'
        placeholder='Enter Name'
        type='text'
        name='name'
        onChange={handleInput}
        value={fieldItems.name}>
        </Input>

        <Button 
        type='button'
        onClick={addingInArray}
        >Save changes</Button>
        </div>
      </CardContent>
      
     <CardFooter>
     <Button 
        onClick={handleSubmit}
        >Add Form</Button>
     </CardFooter>
     
    </Card>
 
  )
}

export default Page
