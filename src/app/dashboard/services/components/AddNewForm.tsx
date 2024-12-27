import { useParams } from "next/navigation";
import React, { useState } from "react";
import { ServiceType } from "../utils/serviceTableSchema";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FiLoader } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface FieldItems {
  type: string;
  name: string;
  label: string;
  data?:string;

}
interface FormFieldItems {
  title: string;
  description: string;
}
interface AddNewFormProp {
  service: ServiceType;
}
function AddNewForm({ service }: AddNewFormProp) {

  const [formFieldItems, setFormFieldItems] = useState({
    title: "",
    description: "",
  });
  const { toast } = useToast();
  const [fieldArray, setFieldArray] = useState<Array<FieldItems>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFormItems = (e) => {
    const { name, value } = e.target;
    setFormFieldItems({
      ...formFieldItems,
      [name]: value,
    });
  };


  // const addingInArray = () => {
  //   setFieldArray((curr) => [...curr, fieldItems]);
  //   setFieldItems({ type: "", name: "", label: "" });
  // };

  const serviceId = service._id;

  async function handleSubmit() {
    const formData = new FormData();
    if (serviceId) {
      formData.append("serviceId", serviceId);
    }
    formData.append("description", formFieldItems.description);
    formData.append("title", formFieldItems.title);
   
     
    console.log(formData);
    try {
      setIsSubmitting(true);
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        "/api/admin/services/forms/create-form",
        formData
      );
      console.log(res);
      if (res.data.statusCode==200) {
        loadingToast.dismiss();
        setIsOpen(false);
        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW Form",
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
    } finally {
      setIsSubmitting(false);
    }
  }

  const allFunctions = service.functions;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger>
        <Button onClick={() => setIsOpen(true)} className="w-full">
          <Plus />
          New Form
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Form Fields</DialogTitle>
          <DialogDescription>
            This dialog allows admins to create and manage custom form fields
            tailored for specific services or categories
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
        <Select
  value={formFieldItems.title || ""}
  onValueChange={(value) => handleFormItems({ target: { name: 'title', value } })}
  
>
  <SelectTrigger>
    <SelectValue placeholder="Select Function" />
  </SelectTrigger>
  <SelectContent>
    {
      (allFunctions?.length===0)?("No Function Found"):
      (
       allFunctions?.map((fun)=>(
    <SelectItem  value={fun}>{fun}</SelectItem>
       ))
      )
    }
   
  </SelectContent>
</Select>
           <Separator/>
        

          <Textarea
            className="border border-chart-1 border-dashed"
            placeholder="Enter description"
            name="description"
            defaultValue={formFieldItems.description || ""}
            onChange={handleFormItems}
            value={formFieldItems.description}
          ></Textarea>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" /> Adding...
              </>
            ) : (
              "Add New Form "
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewForm;
