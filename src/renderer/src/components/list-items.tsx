import { ISearch, ISearchItem } from "src/types/search"
import { ScrollArea, ScrollBar, Viewport } from "@/components/ui/scroll-area"

import Card from "@/components/card"
import React from "react"
import useSWR from "swr"

export default function ListItems({
  title,
  url,
  video = false,
}: {
  title: string
  url: string
  video?: boolean
}): React.ReactElement {
  const {
    data,
    error,
    isLoading,
  }: { data: ISearch | undefined; error: unknown; isLoading: boolean } = useSWR(url)

  return (
    <>
      <div data-video={video} className="group">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{title}</h3>
        <ScrollArea className="flex justify-center pb-2">
          <Viewport>
            <div className="flex w-max group-data-[video=false]:space-x-4 group-data-[video=true]:space-x-5 p-4">
              {error && !data
                ? "Couldn't get the list!"
                : !isLoading &&
                  data?.items.map((item: ISearchItem, i: React.Key | null | undefined) => (
                    <Card
                      video={video}
                      src={item.image}
                      title={item.title}
                      url={item.url}
                      key={i}
                    />
                  ))}
            </div>
          </Viewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  )
}
