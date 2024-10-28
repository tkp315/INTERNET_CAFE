
import { section1_left,section1_btn, section2_left, section2_right, section3_left, section3_right, section4_up, section5_up } from "@/utilities/data/home";
import Navbar from "./Home/components/Navbar";
import Section from "./Home/components/Section";
import { ScrollArea } from "@/components/ui/scroll-area";
import FooterSection from "./Home/components/FooterSection";

export default function Home() {
  return (
   <Navbar>
    <ScrollArea className="h-[calc(100vh-100px)] px-8">
    <div className=" flex flex-col gap-2">
      <Section left={section1_left} right={section1_btn} isButtons={true} direction={true} />
      <Section left={section2_right} right={section2_left} isButtons={false} direction={false} />
      <Section left={section3_left} right={section3_right} isButtons={false} direction={true} />
      <div className="flex-row flex gap-2 items-center">
      <FooterSection inputData={section4_up} btn="Try it out"></FooterSection>
      <FooterSection inputData={section5_up} btn="Demo"/>
      </div>

    </div>
    </ScrollArea>
   </Navbar>
  );
}
