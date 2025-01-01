import { unskippableDialogType } from '@/app/redux/slices/filteration.slice'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Dialog, DialogTitle } from '@radix-ui/react-dialog'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

function UnskipableDialog() {
    const openParam:unskippableDialogType = useSelector((state)=>state.filter).unskippableDialog
    const isOpen = openParam.isOpen
    // C:\Users\HP\Desktop\Internet_shop\shop-app\src\app\client\orderPayment

  return (
    <Dialog open={isOpen} >
     <DialogContent>
     <DialogTitle>
        Attention Required: Unpaid Orders
        </DialogTitle>
        <DialogDescription className='text-sm'>
        You have unpaid orders that need to be cleared before proceeding. Please complete your payment to continue using our services
        </DialogDescription>
        <DialogFooter>
           <Link href={`/client/orderPayment`}>
           <Button >
             Go To Payment
            </Button>
           </Link>
        </DialogFooter>
     </DialogContent>
        
    </Dialog>
  )
}

export default UnskipableDialog
