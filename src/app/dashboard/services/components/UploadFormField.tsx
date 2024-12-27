import { AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import React, { useState } from 'react'
import { FiLoader } from 'react-icons/fi';
import { MdOutlineFileUpload } from 'react-icons/md';
interface UploadFormFieldProp{
    url:string,
}
function UploadFormField({url}:UploadFormFieldProp) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
  
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files) {
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
        toast({
          action:<Info/>,
          title:'FILE INSERTED',
          description:e.target.files[0]?.name,
          variant:'info',
          duration:5000,
        })
      }
    }
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      if (!file) {
        alert("Please select a file first");
        return;
      }
      
      const formData = new FormData();
      formData.append("csv_file", file);
      try {
        const loadingToast = toast({
          title: "Loading",
          action: <FiLoader className=" animate-spin" />,
          variant: "loading",
          duration: 1000000,
        });
        setIsUploading(true);
  
        const res = await axios.post(
         url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
        if(res.data.statusCode===200||res.status===200){
          loadingToast.dismiss();
          setFile(null)
          toast({
            title: "Success",
            action: <CheckCircle className="w-5 h-5" />,
            description:res.data.message || "SUCCESSFULLY ADDED A NEW CATEGORY",
            variant: "success",
            duration: 5000,
          });
        }
      } catch (error) {
        const errMsg = axios.isAxiosError(error)
          ? error.response?.data
          : "Message Not Found";
        console.error("Error uploading file:", error);
        toast({
          title: "Failed",
          description: errMsg,
          duration: 3000,
          variant: "destructive",
          action: <XCircle />,
        });
      } finally {
        setIsUploading(false);
      }
    }
  
    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border border-dashed border-chart-1">
            Upload File
          </Button>
        </DialogTrigger>
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Upload a CSV file below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="fileId" className="cursor-pointer">
                <div className="w-fit p-2 bg-chart-1 rounded-md flex items-center gap-2">
                  Choose File
                </div>
              </Label>
              {/* Hidden file input */}
              <Input
                className="hidden"
                name="file"
                type="file"
                accept=".csv"
                id="fileId"
                onChange={handleFileChange}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full"
              onClick={handleSubmit}
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <MdOutlineFileUpload className="mr-1 text-lg " />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

export default UploadFormField
