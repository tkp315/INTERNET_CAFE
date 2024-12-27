import React, { useState } from "react";
import { ServiceType } from "../utils/serviceTableSchema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaEdit } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface EditType {
  service: ServiceType;
}

interface InputState {
  newName?: string;
  newPrice?: string;
  newThumbnail?: File | null;
  newIsAvailable?: boolean;
}

function EditDialog({ service }: EditType) {
  const [inputField, setInputField] = useState<InputState>({
    newName: service.name,
    newPrice: service.price.toString(),
    newIsAvailable: service.isAvailable,
    newThumbnail: null,
  });
 
  const[isEditting, setIsEditting] = useState(false);
  const [isOpen,setIsOpen] =useState(false);
  const {toast} = useToast()

  const [preview, setPreview] = useState<string | undefined>(service.thumbnail);
   
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(inputField).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      setIsEditting(true);
      const loadingToast = toast({
        title: "Loading",
        action: <FiLoader className=" animate-spin" />,
        variant: "loading",
        duration: 1000000,
      });
      const res = await axios.post(
        `/api/admin/services/edit-service?serviceId=${service._id}`,
        formData
      );
      console.log("Response:", res.data);
      if(res.data.statusCode===200||res.status===200){
        setIsOpen(false)
        loadingToast.dismiss()
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
 
  function handleInputData(e) {
    const { name, value, files } = e.target;

    if (name === "newThumbnail" && files?.[0]) {
      const file = files[0];
      setInputField({ ...inputField, newThumbnail: file });

      const fileReader = new FileReader();
      fileReader.onload = () => setPreview(fileReader.result as string);
      fileReader.readAsDataURL(file);
    } else if (name === "isAvailable") {
      setInputField({ ...inputField, newIsAvailable: value === "true" });
    } else {
      setInputField({ ...inputField, [name]: value });
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Service Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Service Details</h4>
              <p className="text-sm text-muted-foreground">
                Update Service details
              </p>
            </div>

            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={service.name}
                  className="col-span-2 h-8"
                  name="newName"
                  onChange={handleInputData}
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  defaultValue={service.price}
                  className="col-span-2 h-8"
                  name="newPrice"
                  onChange={handleInputData}
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4 mt-2">
                <Label>Is Available</Label>
                <RadioGroup
                  defaultValue={service.isAvailable ? "true" : "false"}
                  className="flex flex-row gap-2"
                  name="newIsAvailable"
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

              <div className="grid grid-cols-3 items-center gap-4 mt-2">
                <Label>Thumbnail</Label>
                {preview ? (
                  <Image
                    className="h-20 w-20 rounded-full outline outline-1 outline-gray-300"
                    src={preview}
                    alt="Thumbnail Preview"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}
                <Label htmlFor="thumbnail" className="cursor-pointer">
                  <Badge>
                    <FaEdit className="text-xl" />
                  </Badge>
                </Label>
                <Input
                  id="thumbnail"
                  type="file"
                  className="hidden"
                  name="newThumbnail"
                  onChange={handleInputData}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
            disabled={isEditting}
            type="submit" variant="default">
             
            {
              isEditting? (<>
              <FiLoader className="animate-spin"/>
              Saving...
              </>):("Save Changes")
            }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
