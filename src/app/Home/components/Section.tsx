
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { section1_btn } from "@/utilities/data/home";
import React from "react";
import Box from "./Box";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionProp {
  left: Array<object>;
  right: string | Array<string> | undefined;
  isButtons: boolean;
  direction: boolean;
}

function Section({ left, right, isButtons, direction }: SectionProp) {
  const isMobile = useIsMobile();
  return (
    <>
       
        <div
          className={` ${!isMobile?
            `
            flex ${
            direction ? `flex-row ` : `flex-row-reverse `
          } w-[90vw] justify-between sm:gap-4 border border-chart-4 mx-10 px-10 py-8 rounded-md mt-3
            `:`flex ${
            direction ? `flex-col ` : `flex-col-reverse `
          } h-fit gap-4 border border-chart-4 mx-10 px-10 py-8 rounded-md mt-3`} `}
        >
          {/* left */}
          <div className={`${isMobile?`gap-4`:``}`}>
            {left.map((e, idx) => (
              <div key={idx} className=" flex flex-col gap-3  ">
                <div>
                  <h1 className=" text-lg font-semibold text-chart-1">
                    {e.heading1 ? e.heading1 : e.title}
                  </h1>
                  <h2 className="text-lg font-semibold text-chart-1">
                    {e.heading2}
                  </h2>
                </div>

                {e.desc1 && e.desc2 ? (
                  <div className=" text-sm">
                    <p>{e.desc1}</p>
                    <p>{e.desc2}</p>
                  </div>
                ) : (
                  <p className="text-sm">{e.value}</p>
                )}
                <Button variant="secondary" className=" w-fit bg-chart-1">
                  {e.button}
                </Button>
              </div>
            ))}
          </div>

          {/* right */}

          <div className={``}>
            {isButtons ? (
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-3">
                  {right.slice(0, 4).map((e, idx) => (
                    <Button
                      variant="outline"
                      className=" border border-dashed border-chart-1"
                      key={idx}
                    >
                      {e}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {section1_btn.slice(4, 8).map((e, idx) => (
                    <Button
                      variant="outline"
                      className=" border border-dashed border-chart-1"
                      key={idx}
                    >
                      {e}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[calc(90vh-300px)]">
                <div className="flex flex-col gap-2">
                  {right.map((e) => (
                    <Box data={e} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      ) 


    </>
  );
}

export default Section;
