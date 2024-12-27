"use client";

// * * This is just a demonstration of delete modal; actual functionality may vary.

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CategoryType } from "@/app/schemas/categoryTableSchema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { ServiceType } from "../utils/serviceTableSchema";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { FiLoader } from "react-icons/fi";

type DeleteProps = {
  service: ServiceType;
};

export default function DeleteDialog({ service }: DeleteProps) {
  const [isOpen, setIsOpen] = useState(false); 
  const [isDeleting,setIsDeleting] =useState(false);
  const {toast}= useToast();
  const handleDelete = async() => {
    try {
      setIsDeleting(true);
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(`/api/admin/services/delete-service?serviceId=${service._id}`)
      console.log(res);
      if(res.data.statusCode===200||res.status===200){
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

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Button to open the dialog */}
      <AlertDialogTrigger asChild>
        <Button variant="outline" size='sm'
        onClick={()=>setIsOpen(true)}>Delete</Button>
      </AlertDialogTrigger>

      {/* Dialog content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete Category
            Details of <b>{service.name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <Button 
          disabled={isDeleting}
          variant="destructive" onClick={handleDelete}>
            {isDeleting?<>
            <FiLoader className="animate-spin"/>
            Deleting...
            </>:"Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
