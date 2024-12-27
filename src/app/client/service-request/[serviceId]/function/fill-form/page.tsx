"use client";
import { ServiceType } from "@/app/dashboard/services/utils/serviceTableSchema";
import Navbar from "@/app/Home/components/Navbar";
import { selectedServiceData } from "@/app/redux/slices/services.slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { Info, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBackward, FaForward } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
interface FormFieldSelectTag {
  name: string;
  data: Array<string>;
}
function Page() {
  const selectedService = useSelector((state) => state.services);
  console.log(selectedService);
  const service = selectedService.selectedService;
  const processingServiceData = selectedService.processingServiceData;
  const dispatch = useDispatch();
  const serviceName = service.serviceName;

  const form = service.forms[0];
  const formField = form.FormField;
  // const totalLength = forms?.length;

  const [currPage, setCurrPage] = useState(1);
  const limit = 10;
  const [resultToBeShown, setResultToBeShown] = useState([]);
  const [filteredResult, setFilteredResult] = useState({});

  const fetchForms = async () => {
    const res = await axios.post(
      `/api/admin/services/forms/filter-form?page=${currPage}&limit=${limit}`,
      { selectedFunctions: processingServiceData.selectedFunctions }
    );
    console.log(res);
    if (res.data.statusCode === 200) {
      setFilteredResult(res.data.data);
      setResultToBeShown(res.data.data.forms);
    }
  };
  const handlePrev = () => {
    if (filteredResult.hasPreviousPage) {
      setCurrPage(currPage - 1);
    }
  };
  const handleNext = () => {
    if (filteredResult.hasNextPage) {
      setCurrPage(currPage + 1);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [currPage]);
  const [countRequiredItems, setCountRequiredItems] = useState(0);
  const [filledFormItems, setFilledFormItems] = useState(0);
  const [formInputs, setFormInputs] = useState({});
  const [formFiles, setFormFiles] = useState({});
  function handleInputs(e, isRequired: boolean) {
    const { name, value } = e.target;

    setFormInputs({ ...formInputs, [name]: value });
    if (isRequired) {
      setCountRequiredItems(countRequiredItems + 1);
    }
    setFilledFormItems(filledFormItems + 1);
    console.log(`${name}:${value}`);
  }
  function handleFiles(e, isRequired: boolean) {
    const file = e.target.files[0];

    setFormFiles({ ...formFiles, [e.target.name]: file });
    // setFormFiles({...formFiles,file})
    if (isRequired) {
      setCountRequiredItems(countRequiredItems + 1);
    }
    setFilledFormItems(filledFormItems + 1);
    console.log(formFiles);
  }
  const navigate = useRouter();
  async function handleFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData();
    const formInputValues = Object.entries(formInputs);
    const formFilesValues = Object.entries(formFiles);

    formInputValues.forEach(([key, value]) => {
      formData.append(key, `${value}`);
    });

    formFilesValues.forEach(([key, value]) => {
      formData.append(`${key}`, value);
      console.log(`${key}`, value);
    });

    const res = await axios.post(
      `/api/client/services/forms/form-submission`,
      formData
    );
    console.log(res);
    if (res.data.statusCode === 200) {
      const data = res.data.data;
      dispatch(
        selectedServiceData({
          ...processingServiceData,
          clientFormDetails: data,
        })
      );
      //client\service-request\[serviceId]\availibility

      navigate.push(`/client/service-request/${service._id}/availibility`);
    }
  }

  const renderField = (field) => {
    const { name, type, label, data, isRequired } = field;

    if (type === "select") {
      const options = data?.split("|").map((o) => o) || [];
      return (
        <div key={name}>
          <Label htmlFor={name}>
            {label}
            {isRequired ? <Star className="text-red-400" /> : ""}
          </Label>
          <Select
            onValueChange={(value) =>
              handleInputs({ target: { name: `${name}`, value } }, isRequired)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.length === 0
                ? "No options Found"
                : options?.map((option: string, idx: number) => (
                    <SelectItem key={idx} value={option}>
                      {option}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div key={name}>
          <Label htmlFor={name}>
            {label}
            {isRequired ? <Star className="text-red-400" /> : ""}
          </Label>
          <Textarea
            id={name}
            onChange={(e) => handleInputs(e, isRequired)}
            name={name}
            placeholder={label}
          ></Textarea>
        </div>
      );
    } else {
      if (type === "file") {
        return (
          <div key={name}>
            <Label htmlFor={name} className="block mb-2 font-medium">
              {label}
              {isRequired ? <Star className="text-red-400" /> : ""}
            </Label>
            <Input
              id={name}
              type={type}
              name={name}
              accept=".pdf"
              onChange={(e) => handleFiles(e, isRequired)}
              placeholder={`Enter ${label}`}
            ></Input>
          </div>
        );
      } else {
        return (
          <div key={name}>
            <Label htmlFor={name} className="block mb-2 font-medium">
              {label}
              {isRequired ? <Star className="text-red-400" /> : ""}
            </Label>
            <Input
              id={name}
              type={type}
              name={name}
              onChange={(e) => handleInputs(e, isRequired)}
              placeholder={`Enter ${label}`}
            ></Input>
          </div>
        );
      }
    }
  };
  const renderCardContent = () => (
    <CardContent>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="flex flex-col gap-4 mt-6 mb-2">
          {resultToBeShown.map((field) => renderField(field))}
        </div>
        {isMobile && renderButton()}
      </ScrollArea>
    </CardContent>
  );
  const renderButton = () => (
    <>
      <div className="flex flex-row gap-5 justify-center items-center mt-4">
        <Button
          onClick={handlePrev}
          disabled={!filteredResult?.hasPreviousPage}
          variant="outline"
          className="border border-chart-1"
        >
          <FaBackward className="mr-2" /> Back
        </Button>

        <p>
          {currPage} of {filteredResult?.totalPages}
        </p>

       
            <Button
          onClick={handleNext}
          disabled={!filteredResult?.hasNextPage}
          variant="outline"
          className="border border-chart-1"
        >
          Next <FaForward className="ml-2" />
        </Button>
         
      </div>

      <Button
        onClick={handleFormSubmission}
        disabled={filteredResult.totalRequiredFields !== countRequiredItems}
        className=" float-right mx-4 my-4"
      >
        Submit
      </Button>
    </>
  );

  const renderCard = () => (
    <Card className={`w-full max-w-xl hover:shadow-xl hover:shadow-chart-1  ${isMobile?`mb-24`:`mb-3`}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <Info size={20} />
          {form.title}
        </CardTitle>
      </CardHeader>
      <Separator />
      {isMobile ? (
        <>
        {renderCardContent()}
  
        </>

      ) : (
        <>
          {renderCardContent()}
          {renderButton()}
        </>
      )}
    </Card>
  );

  const isMobile = useIsMobile();
  return (
    <Navbar>
      <div className="flex flex-col items-center mx-4 mt-6 gap-6">
        <Card className="w-full max-w-xl  hover:shadow-xl hover:shadow-chart-1">
          <CardHeader>
            <CardTitle className="text-center text-lg md:text-xl font-semibold text-secondary-foreground">
              Selected Service:{" "}
              {filteredResult?.formName?.map((e) => {
                if (typeof e === "object") {
                  return e.other;
                } else {
                  return `${e},`;
                }
              })}
              {/* {filteredResult?.formName?.join(",") || "Loading..."} */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Please choose the functions you’d like us to perform for this
              service.
            </p>
          </CardContent>
        </Card>

        {isMobile ? (
          <ScrollArea className="w-full">{renderCard()}</ScrollArea>
        ) : (
          renderCard()
        )}
      </div>
    </Navbar>
  );
}

export default Page;
