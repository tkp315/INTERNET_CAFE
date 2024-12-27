// tab inside sheet
// 1. show all the forms
// inside each form edit, delete
// on the top add new Form

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { ServiceType } from "../utils/serviceTableSchema";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FiLoader } from "react-icons/fi";

interface ServiceProp {
  service: ServiceType;
}
function EditFunction({ service }: ServiceProp) {
  const [inputFunction, setInputFunction] = useState("");
  const [isEdit, setIsEdit] = useState({ idx: -1, state: false });
  const [isDelete, setIsDelete] = useState({ idx: -1, state: false });
  const [isNewFunction, setIsNewFunction] = useState(false);
  const [newfunction, setNewFunction] = useState("");
  const { toast } = useToast();
  const handleDeletion = async (idx: number, fun: string) => {
    if (isDelete.state && isDelete.idx === idx) {
      setIsDelete({ state: false, idx: -1 });
    } else {
      setIsDelete({ state: true, idx: idx });

      try {
        const loadingToast = toast({
          title: "Loading",
          action: <FiLoader className=" animate-spin" />,
          variant: "loading",
          duration: 1000000,
        });
        const res = await axios.post(
          `/api/admin/services/functions/delete-function?serviceId=${service._id}`,
          { funTitle: fun }
        );
        console.log(res);
        if (res.data.statusCode === 200 || res.status === 200) {
          loadingToast.dismiss();
 
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
    }
  };
  const handleSelection = (idx: number) => {
    if (isEdit.state && idx === idx) {
      setIsEdit({ state: false, idx: -1 });
    } else {
      setIsEdit({ state: true, idx: idx });
    }
  };

  const handleEdit = async (fun: string) => {
    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/functions/edit-function?serviceId=${service._id}`,
        { oldfunTitle: fun, newFunTitle: inputFunction }
      );
      console.log(res);
      if (res.data.statusCode === 200 || res.status === 200) {
        loadingToast.dismiss();
      
      setIsEdit({ state: false, idx: -1 })
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
  };
  const handleNewFunction = async () => {

    try {
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/functions/create-function?serviceId=${service._id}`,
        { newFunction: newfunction }
      );
      console.log(res);
      if (res.data.statusCode === 200 || res.status === 200) {
        loadingToast.dismiss();
        setIsNewFunction(false);

        toast({
          title: "Success",
          action: <CheckCircle className="w-5 h-5" />,
          description: res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
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
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isNewFunction ? (
        <div className="flex flex-row gap-2 items-center">
          <Input
            className="border-white border"
            placeholder="Enter new function..."
            onChange={(e) => setNewFunction(e.target.value)}
            type="text"
            name="newFunction "
          ></Input>
          <Button
            onClick={() => handleNewFunction()}
            className="w-fit"
            variant="default"
            size="sm"
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          className=""
          onClick={() => setIsNewFunction(true)}
          variant="default"
        >
          <Plus /> New Function
        </Button>
      )}
      {service?.functions?.map((e, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-1 px-2 py-2 border border-dashed  bg-primary-foreground border-chart-1 rounded-md "
        >
          <Badge className="mb-2 w-fit ">{idx}</Badge>

          <div className="flex flex-row items-center justify-between">
            <Button
              onClick={() => handleSelection(idx)}
              size="sm"
              variant="outline"
            >
              {isEdit.state && isEdit.idx === idx ? "Cancel" : "Edit"}
            </Button>
            <Button
              onClick={() => handleDeletion(idx, e)}
              size="sm"
              variant="outline"
            >
              Delete
            </Button>
          </div>
          {isEdit.state && isEdit.idx === idx ? (
            <div className="flex flex-row gap-2 items-center">
              <Input
                className="border-white border"
                defaultValue={e}
                onChange={(e) => setInputFunction(e.target.value)}
                type="text"
                name="newFunTitle"
              ></Input>
              <Button
                onClick={() => handleEdit(e)}
                className="w-fit"
                variant="default"
                size="sm"
              >
                Save
              </Button>
            </div>
          ) : (
            <span className="text-center uppercase font-semibold">{e}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default EditFunction;
