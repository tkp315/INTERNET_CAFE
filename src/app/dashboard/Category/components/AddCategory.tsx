"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle,  XCircle } from "lucide-react";
function AddCategory() {
  const [state, setState] = useState({
    serviceCategoryName: "",
    description: "",
  });
  const { toast } = useToast();
  const [isSubmitting,setIsSubmitting] =useState(false)
  const [isOpen,setIsOpen] = useState(false);
  async function submit() {
    const loadingToast = toast({
      title: "Loading",
      action: <FiLoader className=" animate-spin" />,
      variant: "loading",
      duration: 1000000,
    });
    try {
      setIsSubmitting(true)
      const res = await axios.post("/api/admin/add-category", {
        serviceCategoryName: state.serviceCategoryName,
        description: state.description,
      });
      if (res.status === 200) {
        loadingToast.dismiss();
        setIsOpen(false);
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(`${name}:${value}`);
  };
  return (
    <Dialog onOpenChange={setIsOpen}  open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={()=>setIsOpen(true)}>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>NEW CATEGORY</DialogHeader>

        <div className="flex flex-col gap-3 w-full justify-center items-center">
          <Input
            onChange={handleInputChange}
            name="serviceCategoryName"
            placeholder="category"
          ></Input>
          <Input
            onChange={handleInputChange}
            name="description"
            placeholder="description"
          ></Input>
          <Button 
          disabled={isSubmitting}
          onClick={submit}>
            {
              isSubmitting? (
                <>
              <FiLoader className="animate-spin mr-2"/>
              Adding..
              </>
              )
              :("Add")
            }
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategory;
