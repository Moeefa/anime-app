import { ISearch, ISearchItem } from "src/types/search";
import { ScrollArea, ScrollBar, Viewport } from "@/components/ui/scroll-area";

import Card from "@/components/card";
import React from "react";
import useSWR from "swr";

export default function ListItems({
  title,
  url,
  video = false,
}: {
  title: string;
  url: string;
  video?: boolean;
}): React.ReactElement {
  const { data, error, isLoading } = useSWR<ISearch>(url);

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
              className="flex w-max data-[video=false]:space-x-4 data-[video=true]:space-x-5 p-4"
            >
              {error && !data
                ? "Couldn't get the list!"
                : !isLoading &&
                  data!.items?.length > 0 &&
                  data?.items.map((item, i) => (
                    <Card
                      key={i}
                      data-video={video}
                      title={item.title}
                      data={item}
                    />
                  ))}
            </div>
          </Viewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
