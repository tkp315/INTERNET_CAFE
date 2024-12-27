"use client";

// * * This is just a demostration of edit modal, actual functionality may vary

import { z } from "zod";
import {
  TaskType,
  labels,
  priorities,
  statuses,
} from "@/app/schemas/taskSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { label_options, priority_options, status_options } from "@/lib/filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CategoryType } from "@/app/schemas/categoryTableSchema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { FiLoader } from "react-icons/fi";

interface EditDialogProp {
  task: CategoryType;
}

interface InputData{
  name:string
  description:string
  isAvailable:boolean
}
export default function EditDialog({ task }: EditDialogProp) {

  const [editCategoryData,setEditCategoryData] = useState<InputData>({
    name:"",
    description:"",
    isAvailable:true
  });
   const {toast } = useToast();
   const [isSubmitting,setIsSubmitting] = useState(false);
   const[isOpen,setIsOpen] = useState(false);
  function handleInputData(e){
    const {name,value}=e.target;
    if(name==='isAvailable'){
      const val = value==='true'?true:false
      setEditCategoryData({...editCategoryData,[name]:val})
    }
    setEditCategoryData({...editCategoryData,[name]:value})
  }

  async function handleSubmit(){
    const data = {
      name:editCategoryData.name,description:editCategoryData.description,isAvailable:editCategoryData.isAvailable,categoryId:task._id
    }
    try {
      setIsSubmitting(true)
      const loadingToast =  toast({
        title: "Saving..",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000000,
      });
      const res = await axios.post('/api/admin/category/edit-category',data)
      console.log(res)
      if (res.status===200) {
        loadingToast.dismiss();
         setIsOpen(false)
        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description:
            res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
          variant: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data
          : "An Error Occured";
      toast({
        title: "Failed",
        description: errMessage,
        duration: 3000,
        variant: "destructive",
        action: <XCircle />,
      });
      
    }
    finally{
      setIsSubmitting(false)
    }
    
  }
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button 
          size="sm"
          onClick={()=>setIsOpen(true)}
          variant="outline">Edit Category</Button>
        </DialogTrigger>
        <DialogContent className="">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Category Details</h4>
              <p className="text-sm text-muted-foreground">
                Update Category details
              </p>
            </div>

            <div className="grid gap-2">

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={task.name}
                  className="col-span-2 h-8"
                  name='name'
                  onChange={handleInputData}
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={task.description}
                  className="col-span-2 h-8"
                  name="description"
                  onChange={handleInputData}
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4 mt-2 ">
                <Label>Is Available</Label>
                <RadioGroup
                  defaultValue={task.isAvailable ? "true" : "false"}
                  className=" flex flex-row gap-2 "
                  name="isAvailable"
                  onChange={handleInputData}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="r1" />
                    <Label htmlFor="r1">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="r2" />
                    <Label htmlFor="r2">False</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='default' 
            onClick={handleSubmit}
            disabled={isSubmitting}
            >
              {
                isSubmitting?<>
                <FiLoader className="animate-spin mr-2"/>
                Saving...
                </>:("Save Changes")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
