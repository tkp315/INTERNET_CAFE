import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadFile from "../../services/components/UploadFile"
import AddServicesManually from "../../services/components/AddServicesManually"
import { CategoryType } from "@/app/schemas/categoryTableSchema"
import { ServiceType } from "../../services/utils/serviceTableSchema"

interface ServieceProp {
    category:CategoryType

}
export function AddServices({category}:ServieceProp) {
    console.log(category)
  return (
    <Sheet>
    <SheetTrigger asChild>
        <Button size="sm" variant='outline'>Add Services</Button>
    </SheetTrigger>

    <SheetContent>
      <SheetHeader>
        <SheetTitle>New Services </SheetTitle>
        <SheetDescription>
          Add new Services here 
        </SheetDescription>
      </SheetHeader>

      <Tabs defaultValue="manually" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manually">Manually</TabsTrigger>
        <TabsTrigger value="upload">Upload CSV</TabsTrigger>
      </TabsList>
      <TabsContent value="manually">
        <AddServicesManually 
        catId={category._id}
        />
      </TabsContent>

      <TabsContent value="upload" className="w-full">
        <UploadFile url="/api/admin/add-services/upload-file"/>
      </TabsContent>
    </Tabs>

    </SheetContent>
  </Sheet>
  
  )
}
