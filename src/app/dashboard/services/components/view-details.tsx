import React from "react";
import { ServiceType } from "../utils/serviceTableSchema";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import EditForm from "./EditForm";
import EditFunction from "./EditFunction";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditType {
  service: ServiceType;
}
function ViewDetails({ service }: EditType) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
        Functions & Forms
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle> Functions & Forms </SheetTitle>
          <SheetDescription>check from chat-gpt</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="function" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="function">Functions</TabsTrigger>
            <TabsTrigger value="form">Forms</TabsTrigger>
          </TabsList>
          <TabsContent value="function">
            <ScrollArea className="h-[calc(100vh-150px)]">
              <EditFunction service={service} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="form" className="w-full">
          

            <ScrollArea className="h-[calc(100vh-150px)]">
              <EditForm service={service}/>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetails;
