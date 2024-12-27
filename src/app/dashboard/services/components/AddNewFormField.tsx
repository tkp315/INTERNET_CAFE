import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { INPUT_TYPES } from "@/lib/constants";

import axios from "axios";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
interface FieldItems {
  type: string;
  name: string;
  label: string;
  data?: string;
  isRequired: boolean;
}
interface AddNewFormFieldProp {
  formId: string;
}
function AddNewFormField({ formId }: AddNewFormFieldProp) {
  const [fieldItems, setFieldItems] = useState<FieldItems>({
    type: "",
    name: "",
    label: "",
    isRequired: false,
    data: "",
  });

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value === "select") {
      setFieldItems({
        ...fieldItems,
        data: value,
      });
    }
    if (name === "isRequired") {
      const val = value === "true" ? true : false;
      setFieldItems({
        ...fieldItems,
        isRequired: val,
      });
    }
    setFieldItems({
      ...fieldItems,
      [name]: value,
    });
    console.log(`${name}:${value}`);
  };

  async function handleSubmit() {
    const formData = new FormData();

    formData.append("fieldObj", JSON.stringify(fieldItems));
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
        `/api/admin/services/forms/edit-form/new-field?formId=${formId}`,
        formData
      );
      console.log(res);
      if (res.data.statusCode === 200) {
        loadingToast.dismiss();
        setIsOpen(false);
        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW Form",
          variant: "success",
          duration: 5000,
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
        duration: 5000,
        variant: "destructive",
        action: <XCircle />,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2"
        >
          <Plus />
          New Field
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Add Form Fields</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col  gap-4 py-4">
          <Input
            className="border border-chart-1 border-dashed"
            placeholder="Enter Name"
            type="text"
            name="name"
            onChange={handleInput}
            value={fieldItems.name}
          />
          <Input
            className="border border-chart-1 border-dashed"
            placeholder="Enter Label"
            type="text"
            name="label"
            onChange={handleInput}
            value={fieldItems.label}
          />
          <div className="flex flex-row gap-3 items-center">
            <Label> Field Type </Label>
            <Select
              onValueChange={(value) =>
                handleInput({ target: { name: "type", value } })
              }
              name="type"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Field Type " />
              </SelectTrigger>
          
            <SelectContent >
            <ScrollArea className="h-[calc(100vh-400px)]">
                {
                  INPUT_TYPES.map((input,id)=>(
                <SelectItem key={id} value={`${input.value}`}>
                  {input.label}
                </SelectItem>

                  ))
                }
                 </ScrollArea>
              </SelectContent>
           
            </Select>
          </div>

          <div className="flex flex-row gap-3 items-center">
            <Label> Required </Label>
            <Select
              onValueChange={(value) =>
                handleInput({ target: { name: "isRequired", value } })
              }
              name="isRequired"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Required or Not" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">False</SelectItem>
                <SelectItem value="true">True</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fieldItems.type === "select" && (
            <Input
              className="border border-chart-1 border-dashed"
              placeholder="Enter data for type-select"
              type="text"
              name="data"
              onChange={handleInput}
              value={fieldItems.data}
            ></Input>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" />
                Adding...
              </>
            ) : (
              "Add New Field"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewFormField;
