import Card from "@/components/card";
import { ISearch } from "@/types/search";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DisplayItems({
  data,
  title,
  video = false,
}: {
  data: ISearch | null;
  title: string;
  video?: boolean;
}): React.ReactElement {
  return (
    <>
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <div
          data-video={video}
          className="p-4 flex flex-wrap justify-center gap-4 data-[video=true]:gap-6"
        >
          {data ? (
            data.items.map((item, i) => (
              <Card key={i} title={item.title} data-video={video} data={item} />
            ))
          ) : (
            <>
              {[...new Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  data-video={video}
                  className="data-[video=false]:w-[160px] data-[video=false]:h-[274.7px] data-[video=true]:w-[256px] data-[video=true]:h-[192.88px]"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
