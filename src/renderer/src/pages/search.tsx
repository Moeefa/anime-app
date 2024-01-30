import { ISearch, ISearchItem } from "src/types/search"

import Card from "@/components/card"
import React from "react"
import { useLocation } from "react-router-dom"
import useSWR from "swr"

export default function Search(): React.ReactElement {
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  // eslint-disable-next-line prettier/prettier
  const { data, error, isLoading }: { data: ISearch | undefined; error: unknown; isLoading: boolean } = useSWR(`${window.api.URL}/search?search=${params.get("q")?.split(" ").join("-")}&site=${window.api.SITE}&page=1`,)

  return (
    <>
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Search</h3>
        <div className="p-4 flex flex-wrap gap-4">
          {error
            ? "Couldn't get the list!"
            : !isLoading && data?.items.length === 0
              ? "Couln't find any results."
              : data?.items.map((item: ISearchItem, i: React.Key | null | undefined) => (
                  <Card
                    src={item.image}
                    title={item.title}
                    url={item.url}
                    key={i}
                    className="block w-[138px]"
                  />
                ))}
        </div>
      </div>
    </>
  )
}
