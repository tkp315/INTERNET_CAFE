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
import { useToast } from "@/hooks/use-toast";
import { FiLoader } from "react-icons/fi";
import { CheckCircle, XCircle } from "lucide-react";

type DeleteProps = {
  category: CategoryType;
};
export default function DeleteDialog({ category }: DeleteProps) {
  const [isOpen, setIsOpen] = useState(false); 
  const [isDeleting,setIsDeleting] = useState(false);
  const {toast} = useToast();

  const handleDelete = async() => {
   
    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      setIsDeleting(true)
      const res = await axios.post('/api/admin/category/delete-category',{categoryId:category._id})
      if (res.status === 200) {
        loadingToast.dismiss();
        setIsOpen(false)
        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description:
            res.data.message || "SUCCESSFULLY DELETED CATEGORY",
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
setIsDeleting(false)
    }
   
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
        onClick={()=>setIsOpen(true)}
        variant="outline" size='sm'>Delete</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete Category
            Details of <b>{category.name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <Button 
          disabled={isDeleting}
          variant="destructive" onClick={handleDelete}>
            {
              isDeleting?
              <>
              <FiLoader className="animate-spin"/>
               Deleting...
              </>
              :("Delete")
            }
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
