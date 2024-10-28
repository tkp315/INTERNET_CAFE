import { Button } from '@/components/ui/button'
import React from 'react'
import Pagination from './Pagination'
import Card from './ServiceCard'

function ServiceCategoryBox() {
    // box
    //heading
    //1. name of category
    //2. viewAllButton->dialog containing all the service 1. pic: (name,price)
    //3. collapse

  return (
    <div className='border border-x-chart-1 rounded-md px-3 py-3'>
      <div className=' flex flex-col gap-2'>

        <div className=' flex flex-row justify-between items-center'>
             <h1 className='text-2xl font-semibold'>
                Category
             </h1>
             <Button variant="outline">
                View All
             </Button>
        </div>
        <Card/>
      <Pagination/>
      </div>
    </div>
  )
}

export default ServiceCategoryBox
