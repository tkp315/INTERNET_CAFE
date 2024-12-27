"use client";

import Navbar from "@/app/Home/components/Navbar";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import ServiceCard from "./components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSession } from "next-auth/react";
import useSearch from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Cross, Filter, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import useDebounce from "@/hooks/useDebounce";
import OtherService from "./components/other-service";

interface FilterationOption {
  name?: string;
  page: number;
  limit: number;
  isAvailable?: string;
  category?: string;
}

interface PaginationResult {
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Category {
  _id: string;
  name: string;
}
const limitOptions = [
  { option: "15", val: 15 },
  { option: "30", val: 30 },
  { option: "45", val: 45 },
  { option: "60", val: 60 },
];
function Page() {
  const [services, setServices] = useState([]);
  const [paginationResult, setPaginationResult] = useState<PaginationResult>();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUnavailable, setIsunavailable] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterationOption>({
    name: "",
    page: 1,
    limit: 15,
    isAvailable: "",
    category: "",
  });

  const debouncedFilterOptions = useDebounce(filterOptions,300);
  const handleAllServices = useCallback(async () => {
    try {
      const res = await axios.post(
        `/api/admin/services/filteration?page=${debouncedFilterOptions?.page}&limit=${debouncedFilterOptions?.limit}&isAvailable=${debouncedFilterOptions?.isAvailable}&name=${debouncedFilterOptions?.name}&category=${debouncedFilterOptions?.category}`
      );
      if (res.status === 200) {
        const result = res.data;
        setServices(result.docs);
        setPaginationResult({
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
          limit: result.limit,
          page: result.page,
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error.message);
    }
  }, [debouncedFilterOptions]);
 

  

  async function fetchAllCategories() {
    // src/app/api/client/category/fetch/route.ts
    const res = await axios.get(`/api/client/category/fetch`);
    console.log(res);
    if (res.status === 200) {
      setCategories(res?.data?.data?.tableData);
    } else console.log("categories not found");
  }
  useEffect(()=>{
    fetchAllCategories()
  },[])

  // filteration

  const updateFilteration = useCallback(() => {
    const isAvailableRes =
      (isAvailable && isUnavailable) || (!isAvailable && !isUnavailable)
        ? ""
        : isAvailable
        ? "true"
        : "false";
  
    setFilterOptions((prev) => ({
      ...prev,
      isAvailable: isAvailableRes,
    }));
  }, [isAvailable, isUnavailable]);
 
   useEffect(()=>{
 handleAllServices()
   },[debouncedFilterOptions,handleAllServices])
  // Pagination logic
  function handlePrev() {
    if (!paginationResult?.hasPreviousPage) return;
    setFilterOptions({ ...filterOptions, page: filterOptions.page - 1 });
  }
  useEffect(() => {
    updateFilteration();
  }, [isAvailable, isUnavailable,updateFilteration]);

  function handleNext() {
    if (!paginationResult?.hasNextPage) return;
    setFilterOptions({ ...filterOptions, page: filterOptions.page + 1 });
  }

  // searching
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        setQuery(input);
        setFilterOptions({ ...filterOptions, name: query });
      } else {
        setFilterOptions({ ...filterOptions, name: "" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input,query]);

  const isMobile = useIsMobile();

  // const FilterTray = useMemo(() => {
  //   return Object.entries(debouncedFilterOptions).map(([key, val]) => {
  //     if ((key === "category" && val) || (key === "isAvailable" && val)) {
  //       return (
  //         <Button
  //           key={key}
  //           onClick={() => {
  //             setFilterOptions({ ...filterOptions, [key]: "" });
  //           }}
  //           size="sm"
  //           className="relative"
  //         >
  //           {key}
  //           <XCircle size={14} className="absolute top-0 right-0 " />
  //         </Button>
  //       );
  //     }
  //     return null;
  //   });
  // }, [filterOptions]);
  return (
    <Navbar>
      <div className={`flex ${isMobile?`flex-col`:`flex-row`}  justify-around w-[100vw] mx-4 my-4 `}>
        
        {
          !isMobile?(
          <Card className="rounded-lg border shadow-md w-[350px] h-fit p-4 border-chart-1">
            <CardHeader>
              <Input
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full mb-4"
              />
            </CardHeader>
  
            <CardContent>
              {/* Filter by Category Section */}
  
              {/* applied filter tray  */}
              <div className="flex flex-row gap-2 mb-2 mt-2">
                {Object.entries(filterOptions).map(([key, val]) => {
                  if (
                    (key === "category" && val) ||
                    (key === "isAvailable" && val)
                  ) {
                    return (
                      <Button
                        onClick={() => {
                          setFilterOptions({ ...filterOptions, [key]: "" });
                        }}
                        size="sm"
                        className="relative"
                      >
                        {key}
                        <XCircle size={14} className="absolute top-0 right-0 " />
                      </Button>
                    );
                  }
                })}
              </div>
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Filter by Category</h3>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <ul>
                    {categories?.map((cat) => (
                      <li key={cat._id} className="flex flex-col gap-3">
                        <Label
                          className={`${
                            filterOptions.category === cat._id
                              ? `bg-chart-1 px-2 py-2 hover:bg-chart-1`
                              : `px-2 py-2 hover:bg-secondary`
                          } rounded-md`}
                          htmlFor={cat._id}
                        >
                          {cat.name}
                        </Label>
                        <Checkbox
                          checked={filterOptions.category === cat._id}
                          id={cat._id}
                          className="hidden"
                          onCheckedChange={(checked) => {
                            setFilterOptions({
                              ...filterOptions,
                              category: checked ? cat._id : "", // Clear category if unchecked
                            });
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </section>
  
              {/* Filter by Availability Section */}
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Filter by Availability
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={isAvailable}
                      onCheckedChange={(checked) => setIsAvailable(checked)}
                      id="available"
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isUnavailable}
                      onCheckedChange={(checked) => setIsunavailable(checked)}
                      id="unavailable"
                    />
                    <Label htmlFor="unavailable">Unavailable</Label>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>):
          (
            <div  className="flex flex-col gap-2">
              <Input
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Type a command.... "
              ></Input>
              <div className="flex flex-row gap-2 items-center">
                <Dialog>
                  <DialogTrigger>
                  <Button className="flex flex-row items-center w-fit mb-2">
                  <Filter/> Filter
                  </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex flex-col gap-2">
                   <Card>
                    <CardContent>
                    <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Filter by Category</h3>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <ul>
                    {categories?.map((cat) => (
                      <li key={cat._id} className="flex flex-col gap-3">
                        <Label
                          className={`${
                            filterOptions.category === cat._id
                              ? `bg-chart-1 px-2 py-2 hover:bg-chart-1`
                              : `px-2 py-2 hover:bg-secondary`
                          } rounded-md`}
                          htmlFor={cat._id}
                        >
                          {cat.name}
                        </Label>
                        <Checkbox
                          checked={filterOptions.category === cat._id}
                          id={cat._id}
                          className="hidden"
                          onCheckedChange={(checked) => {
                            setFilterOptions({
                              ...filterOptions,
                              category: checked ? cat._id : "", // Clear category if unchecked
                            });
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </section>
  
              {/* Filter by Availability Section */}
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Filter by Availability
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={isAvailable}
                      onCheckedChange={(checked) => setIsAvailable(checked)}
                      id="available"
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isUnavailable}
                      onCheckedChange={(checked) => setIsunavailable(checked)}
                      id="unavailable"
                    />
                    <Label htmlFor="unavailable">Unavailable</Label>
                  </div>
                </div>
              </section>
                    </CardContent>
                   </Card>
                    </div>
                  </DialogContent>
                </Dialog>
                {Object.entries(filterOptions).map(([key, val]) => {
                  if (
                    (key === "category" && val) ||
                    (key === "isAvailable" && val)
                  ) {
                    return (
                      <Button
                        onClick={() => {
                          setFilterOptions({ ...filterOptions, [key]: "" });
                        }}
                        size="sm"
                        className="relative"
                      >
                        {key}
                        <XCircle size={14} className="absolute top-0 right-0 " />
                      </Button>
                    );
                  }
                })}
            
              </div>
             
            </div>
            
          )
        }
        
        <>
        {services.length === 0 ? 
        (
          <div className="flex justify-center items-center min-h-screen">
            NO RESULT FOUND
          </div>
        ) : (
          <div className="flex flex-col gap-2 ">
            <div
              className={`grid ${isMobile?`grid-cols-2`:`grid-cols-3`} grid-rows-${
                filterOptions.limit / 3
              }  gap-4`}
            >
        <OtherService/>

              {services.map((e) => (
                <ServiceCard
                  key={e._id}
                  service={e}
                  query={query}
                ></ServiceCard>
              ))}
            </div>
            {/* pagination */}
            
              <div className={`flex flex-row gap-3 ${isMobile?`mt-2 mb-7`:`mt-4`} justify-center items-center`}>
                Page {paginationResult?.page} of{" "}
                {paginationResult?.totalPages || "calculating..."}
                <Button
                  disabled={!paginationResult?.hasPreviousPage}
                  onClick={handlePrev}
                >
                  Prev
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  <Select
                    defaultValue="15"
                    onValueChange={(val) =>
                      setFilterOptions({ ...filterOptions, limit: Number(val) })
                    }
                  >
                    <SelectTrigger className="w-fit">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        {limitOptions.map((e, idx) => (
                          <SelectItem key={idx} value={e.option}>
                            {e.val}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  disabled={!paginationResult?.hasNextPage}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            
          </div>
        )
      }
        </>
        
      </div>
    </Navbar>
  );
}

export default Page;
