
import { Separator } from '@/components/ui/separator';
import React from 'react'
import * as Icons from 'react-icons/fa';

interface Data{
    key:string,
    icon:string,
    value:string

}
function Box({data}:Data) {
    const IconComponent = Icons[data.icon]
  return (
    <div className='flex flex-col gap-1'>
       <div className='w-10 h-10 rounded-full bg-chart-4 flex items-center justify-center'>
  <IconComponent className="text-xl" />
</div>

      <h1 className='font-semibold text-lg text-chart-1'> 
        {data.key}
      </h1>
      <p className=''>
        {data.value}
      </p>
      <Separator className='my-2'/>
    </div>
  )
}

export default Box
