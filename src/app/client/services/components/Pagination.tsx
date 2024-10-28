import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'

function Pagination() {
    // fetching 
    // array 
    const dataSet = [1,2,3,4,5,6,7,8,9,10,11];
    const [resultToBeShown, setResultToBeShown] = useState<Array<number>>([]);
    const [page,setPage]=useState(0);
    const [limit,setLimit] =useState(5);
    const totalPages = Math.ceil(dataSet.length/limit);
   function logic(){
    const start_idx = (page*limit);
    const end_idx = start_idx+limit;
    const newArr = dataSet.slice(start_idx,end_idx);
    setResultToBeShown(newArr);
   }

   function handlePrev(){
    if(page===0)return;
    setPage(page-1);
   }
   function handleNext(){
    if(page===totalPages)return;
    setPage(page+1);
   }
   
   function jumpToPage(curr_page){
     setPage(curr_page);
   }
   const RenderCompo = ({ times }: { times: number }) => {
    return (
      <div className='flex gap-2'>
        {Array.from({ length: times }).map((_, index) => (
          <Button key={index} onClick={() => jumpToPage(index)} variant={page === index ? 'secondary' : 'outline'}>
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };
   useEffect(()=>{
    logic()
   },[page,limit])
  return (
    <div >
        <div>
            {resultToBeShown.map((e)=>e)}
        </div>
      <div className=' flex flex-row gap-3'>
      <Button onClick={handlePrev}>Pre</Button>
      <RenderCompo times={totalPages}/>
      <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}

export default Pagination
