import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DataContext } from "@/contexts/data-context";

export default function Episodes(): React.ReactElement {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { data } = useContext(DataContext);

  return (
    <>
      <div>
        {data ? (
          <div className="flex gap-6">
            <div className="w-52 space-y-4">
              <img
                className="rounded-md aspect-[9/12.8] object-cover w-52"
                src={data?.image}
                alt={data?.title}
              />
              <div>
                <ScrollArea className="w-full max-h-48 rounded-md border mb-6 overflow-auto">
                  <div className="p-4 h-full">
                    {data && data.seasons?.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <p>There's nothing here! 😓</p>
                      </div>
                    ) : (
                      data &&
                      data.seasons?.map((season, i) => (
                        <div key={i}>
                          <h4 className="mb-4 text-sm font-medium leading-none">
                            {season.title}
                          </h4>
                          {season.episodes.map((episode, i: number) => (
                            <Link
                              to={`/watch?url=${encodeURIComponent(
                                episode.url,
                              )}&origin=${encodeURIComponent(
                                params.get("url")!,
                              )}&ep=${i + 1}`}
                              key={i}
                              className="text-sm [&:not(:last-child)]:border-b p-2 flex flex-col"
                            >
                              Episódio {i + 1}
                            </Link>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {data?.title}
              </h3>
              <small className="text-sm leading-none py-6">
                {data?.description}
              </small>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}

const Loading = () => (
  <>
    <div className="flex gap-6">
      <Skeleton className="min-w-52 w-52 aspect-[9/12.8] rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-full rounded-full scroll-m-20 h-6 text-2xl font-semibold tracking-tight" />
        {[...new Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            style={{ width: Math.floor(Math.random() * 10) + 12 + "rem" }}
            className={`text-sm h-3 rounded-full leading-none`}
          />
        ))}
      </div>
    </div>
  </>
);
