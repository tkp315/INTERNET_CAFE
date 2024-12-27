// tab inside sheet
// 1. show all the forms
// inside each form edit, delete
// on the top add new Form

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { ServiceType } from "../utils/serviceTableSchema";
import AddNewForm from "./AddNewForm";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import AddNewFormField from "./AddNewFormField";
import { CheckCircle, XCircle } from "lucide-react";
import { FiLoader } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import UploadFile from "./UploadFile";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import UploadFormField from "./UploadFormField";

interface EditFormProp {
  service: ServiceType;
}
interface InputData {
  name: string | "";
  type: string | "";
  label: string | "";
}
function EditForm({ service }: EditFormProp) {
  const [inputValue, setInputValue] = useState<InputData>({
    name: "",
    type: "",
    label: "",
  });
  const { toast } = useToast();
  async function handleEdition(formId: string, insideFormId: string) {
    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/forms/edit-form?formId=${formId}`,
        {
          name: inputValue.name,
          label: inputValue.label,
          type: inputValue.type,
          insideFormId,
        }
      );
      console.log(res);
      if (res.data.statusCode === 200 || res.status === 200) {
        loadingToast.dismiss();

        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
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
  }
  async function handleDeletion(formId: string, insideFormId: string) {
    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/forms/edit-form/delete-form-field?formId=${formId}`,
        { insideFormId }
      );
      console.log(res);
      console.log(res);
      if (res.data.statusCode === 200 || res.status === 200) {
        loadingToast.dismiss();

        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
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
  }

  function handleInputData(e) {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  }

  async function deleteForm(formId: string) {
    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/forms/delete-form?formId=${formId}`
      );
      if (res.data.statusCode === 200 || res.status === 200) {
        loadingToast.dismiss();

        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
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
  }
  return (
    <div className="flex-col gap-3 flex">
      <AddNewForm service={service} />
      {service.forms?.length === 0 ? (
        <p className="flex justify-center items-center"> No Forms Found</p>
      ) : (
        service?.forms?.map((form, idx) => (
          <Card className="border border-dashed border-chart-1" key={form._id}>
            <CardHeader>
              <Badge className="w-fit">Form {idx + 1}</Badge>
              <CardTitle className="text-center uppercase">
                {form.title}
              </CardTitle>
              <CardDescription>{form.description}</CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex flex-row gap-4 justify-between">
              <AddNewFormField formId={form._id || ""} />
              <UploadFormField url={`/api/admin/services/forms/upload-file?formId=${form._id}`}/>
              </div>
              <div className="grid gap-4">
                {form.FormField.map((field, index) => (
                  <div key={field._id} className="grid gap-1">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="hover:bg-secondary">
                        Field {index + 1}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`name-${field._id}`}>Name</Label>
                      <Input
                        id={`name-${field._id}`}
                        defaultValue={field.name}
                        className="col-span-2 h-8"
                        name="name"
                        onChange={handleInputData}
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`label-${field._id}`}>Label</Label>
                      <Input
                        id={`label-${field._id}`}
                        defaultValue={field.label}
                        className="col-span-2 h-8"
                        name="label"
                        onChange={handleInputData}
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`type-${field._id}`}>Type</Label>
                      <Input
                        id={`type-${field._id}`}
                        defaultValue={field.type}
                        className="col-span-2 h-8"
                        name="type"
                        onChange={handleInputData}
                      />
                    </div>
                    <div className="flex-row flex justify-between items-center mt-3">
                      <Button
                        className="border border-chart-1 text-chart-1 "
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdition(form._id, field?._id)}
                      >
                        Save Field Change
                      </Button>
                      <Button
                        size="sm"
                        className="border border-destructive text-destructive"
                        onClick={() => handleDeletion(form._id, field._id)}
                        variant="outline"
                      >
                        Delete Field
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-row flex justify-between items-center">
              <Button
                onClick={() => deleteForm(form._id)}
                variant="destructive"
              >
                Delete Form
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

export default EditForm;
