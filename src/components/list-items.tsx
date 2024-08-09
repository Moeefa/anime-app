import { ScrollArea, ScrollBar, Viewport } from "@/components/ui/scroll-area";
import React from "react";

import Card from "@/components/card";
import { Search } from "src/types/search";
import { Skeleton } from "./ui/skeleton";

export default function ListItems({
  title,
  data,
  video = false,
}: {
  title: string;
  data: Search | null;
  video?: boolean;
}): React.ReactElement {
  return (
    <>
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <ScrollArea className="flex justify-center pb-2">
          <Viewport>
            <div
              data-video={video}
              className="flex w-full data-[video=false]:space-x-4 data-[video=true]:space-x-5 overflow-x-hidden py-4"
            >
              {data ? (
                !data.items.length ? (
                  <div className="h-32 flex items-center justify-center w-full bg-card/60 rounded-md border border-border">
                    <p className="text-lg">There's nothing here... 🌵</p>
                  </div>
                ) : (
                  data.items.map((item, i) => (
                    <Card
                      key={i}
                      data-video={video}
                      title={item.title}
                      data={item}
                    />
                  ))
                )
              ) : (
                <>
                  {[...new Array(10)].map((_, i) => (
                    <Skeleton
                      key={i}
                      data-video={video}
                      className="data-[video=false]:w-[160px] data-[video=false]:h-[274.7px] data-[video=true]:w-[256px] data-[video=true]:h-[192.88px]"
                    />
                  ))}
                </>
              )}
            </div>
          </Viewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
