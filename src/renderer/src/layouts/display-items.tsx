import { ISearch, ISearchItem } from "src/types/search"

import Card from "@/components/card"
import React from "react"
import useSWR from "swr"

export default function DisplayItems({
  url,
  title,
  video = false,
}: {
  url: string
  title: string
  video?: boolean
}): React.ReactElement {
  const {
    data,
    error,
    isLoading,
  }: { data: ISearch | undefined; error: unknown; isLoading: boolean } = useSWR(url)

  return (
    <>
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{title}</h3>
        <div data-video={video} className="p-4 flex flex-wrap gap-4 data-[video=true]:gap-6">
          {error
            ? "Couldn't get the list!"
            : !isLoading && data?.items.length === 0
              ? "Couln't find any results."
              : data?.items.map((item: ISearchItem, i: React.Key | null | undefined) => (
                  <Card video={video} src={item.image} title={item.title} url={item.url} key={i} />
                ))}
        </div>
      </div>
    </>
  )
}
