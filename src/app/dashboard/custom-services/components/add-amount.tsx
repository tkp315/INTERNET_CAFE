import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import useApiToast from '@/hooks/useApiToast'
import axios from 'axios';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
interface AddAmountProp{
    requestId:string,
    defaultAmount:number
}
function AddAmount({requestId,defaultAmount}:AddAmountProp) {
    const apiCall = useApiToast();
    async function addAmountDetails(){
        // src/app/api/admin/other-services/add-amount
        const url = '/api/admin/other-services/add-amount'
        const res = await apiCall(url,{requestId,amount},axios.post)
        console.log(res);

    }
    const [amount,setAmount]= useState(0);
    console.log(defaultAmount)
  return (
    <Card className=" w-fit space-y-2">
    <CardTitle>Add Amount</CardTitle>
    <CardContent>

       <div className='flex flex-col gap-1'>
        <Label>Amount</Label>
        <Input
        className='border-chart-1'
        name="addAmount"
        defaultValue={defaultAmount}
        onChange={(e)=>setAmount(Number(e.target.value))}
        type="number"
        />
       </div>
    </CardContent>
    <CardFooter>
        <Button 
        onClick={addAmountDetails}
        variant="outline">Save</Button>
    </CardFooter>
</Card>
  )
}

export default AddAmount
