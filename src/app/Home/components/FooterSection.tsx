import { Button } from '@/components/ui/button';
import React from 'react';

function FooterSection({ inputData, btn }) {
  return (
    <div className='flex flex-col gap-4 mx-10 border border-dashed border-chart-1 rounded-xl p-7 mt-3 w-[50vw]'>
      {inputData.map((e, idx) => (
        <div key={idx} className='flex flex-col gap-4'>
          {/* Title */}
          <p className='text-lg text-center font-semibold'>
            {e.title}
          </p>

          {/* Main Content */}
          <p className='text-justify text-lg text-blue-400 font-mono mb-5'>
            {e.value}
          </p>

          {/* Description Section */}
          <div className='flex flex-col gap-1'>
            <h2 className='font-semibold'>
              {e.des1}
            </h2>
            <p className=' text-sm'>
              {e.des2}
            </p>
          </div>

          {/* Button */}
          <Button variant="default" className='w-fit'>
            {btn}
          </Button>

          {/* Placeholder for Images */}
          <div className='mt-4'>
            {/* Insert proper image */}
            <p className='italic text-sm text-center'>Insert proper image here</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FooterSection;
