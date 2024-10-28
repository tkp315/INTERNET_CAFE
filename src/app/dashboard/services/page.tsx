"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";
import { serviceSchema } from "@/app/schemas/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FiLoader } from "react-icons/fi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

type FormData = z.infer<typeof serviceSchema>;

function page() {
  const form = useForm<FormData>({
    defaultValues: {
      serviceName: "",
      servicePrice: "",
      functions:[],
    //   isAvailable: true,
      categoryId: "",
    //   thumbnail: "",
    },
    resolver: zodResolver(serviceSchema),
  });

  const {
    formState: { errors },
  } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setAllCategories] = useState([]);

  const gettingCategories = async () => {
    const res = await axios.get("/api/admin/fetch/category");
    setAllCategories(res.data.data);
    console.log(res);
  };

  useEffect(() => {
    gettingCategories();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    const formData = new FormData()
    formData.append("functions",JSON.stringify(data.functions))
    formData.append("categoryId",data.categoryId);
    formData.append("serviceName",data.serviceName);
    formData.append("servicePrice",data.servicePrice);
    formData.append("isAvailable",(data.isAvailable).toString())
    formData.append("thumbnail",data.thumbnail)
    
    const res = await axios.post("/api/admin/add-services",formData,{headers:{
        'Content-Type':'multipart/form-data'
    }})
    console.log(res)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Services</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-3 flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter service name"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>

                    <FormMessage>
                      {errors["serviceName"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servicePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter service Price"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>

                    <FormMessage>
                      {errors["servicePrice"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="category" />
                        </SelectTrigger>

                        <SelectContent>
                          <ScrollArea className="h-[calc(100vh-300px)]">
                            {categories.map((item,idx) => (
                              <SelectItem key={idx} value={item._id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage>
                      {errors["categoryId"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />


<FormField
                control={form.control}
                name="functions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter functions"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>

                    <FormMessage>
                      {errors["servicePrice"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>

                    <FormMessage>
                      {errors["thumbnail"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Available</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
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
                    </FormControl>

                    <FormMessage>
                      {errors["isAvailable"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </FormProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default page;
