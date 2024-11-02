"use client";
import { serviceSchema } from "@/app/schemas/adminSchema";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormFields from "../components/FormFields";
import { Label } from "@/components/ui/label";
import { FiLoader, FiPlus } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
type FormData = z.infer<typeof serviceSchema>;
interface CategoryData {
  _id: string;
  name: string;
}

function Page() {
  const form = useForm<FormData>({
    defaultValues: {
      serviceName: "",
      servicePrice: "",
      functions: [],
      // //   isAvailable: true,
      categoryId: "",
      // thumbnail: "",
    },
    resolver: zodResolver(serviceSchema),
  });

  const {
    formState: { errors },
  } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setAllCategories] = useState<Array<CategoryData>>();
  const [functions, setFunctions] = useState<Array<string>>([]);
  const [functionsFile, setFunctionFile] = useState<File | null>();
  const { toast } = useToast();

  const insertingFunctions = (funVal: string) => {
    if (funVal === "") return;
    console.log(funVal);
    try {
      if (functions.includes(funVal) || !funVal) return;

      setFunctions([...functions, funVal]);
      console.log(functions);
      form.setValue("functions", functions);
    } catch (error) {
      console.log("ERR: while adding ", error);
    }
  };

  const gettingCategories = async () => {
    const res = await axios.get("/api/admin/fetch/category");
    setAllCategories(res.data.data);
    console.log(res);
  };

  useEffect(() => {
    gettingCategories();
  }, []);
  console.log(functions);
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    const formData = new FormData();

    data.functions?.forEach((element) => formData.append("functions", element));
    if (data.functionsFile)
      formData.append("functionsFile", data.functionsFile);
    formData.append("categoryId", data.categoryId);
    formData.append("serviceName", data.serviceName);
    formData.append("servicePrice", data.servicePrice);
    formData.append("isAvailable", data.isAvailable.toString());
    formData.append("thumbnail", data.thumbnail);

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/admin/add-services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      form.setValue("categoryId", "");
      form.setValue("functions", []);
      form.setValue("serviceName", "");
      form.setValue("servicePrice", "");

      toast({
        title: res.data?.success,
        description: res.data.message,
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? error.response?.data
        : "An error occured";
      toast({
        title: "Failed",
        description: errorMsg,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Services</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
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
                        value={field.value}
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
                        // value={field.value}
                      />
                    </FormControl>

                    <FormMessage>
                      {errors["servicePrice"]?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

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
                            {categories?.map((item, idx) => (
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
              {/* functions  */}
              <div className=" flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="functions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Function</FormLabel>
                      <FormControl>
                        <div className=" flex flex-row gap-2 items-center">
                          <Input
                            placeholder="Enter functions"
                            {...field}
                            onChange={(e) => field.onChange(e)}
                            value={field.value ? field.value : ""}
                          />
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => insertingFunctions(field.value)}
                            className=" border-dashed border border-chart-1"
                          >
                            <FiPlus className="text-foreground text-balance" />
                            Add
                          </Button>
                        </div>
                      </FormControl>

                      <FormMessage>
                        {errors["functions"]?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="flex flex-row gap-2 ">
                  <ScrollArea className="w-[100vw-200px] overflow-x-auto flex flex-row gap-2 ">
                    {functions?.length > 0
                      ? functions.map((e, idx) => (
                          <Badge className="m-1 relative" key={idx}>
                            {e}
                          </Badge>
                          // here cross logic
                        ))
                      : ""}
                  </ScrollArea>
                </div>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 font-semibold">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <FormField
                  control={form.control}
                  name="functionsFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".txt"
                          // value={field.value}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                      </FormControl>

                      <FormMessage>
                        {errors["functionsFile"]?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        // value={field.value}
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
                        // value={field.value ? "true" : "false"}
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

export default Page;
