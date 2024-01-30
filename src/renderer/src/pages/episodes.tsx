import { Link, useLocation } from "react-router-dom"

import { IAnime } from "src/types/anime"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import useSWR from "swr"

export default function Episodes(): React.ReactElement {
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const {
    data,
    error,
    isLoading,
  }: { data: IAnime | undefined; error: unknown; isLoading: boolean } = useSWR(
    `${window.api.URL}/anime?url=${params.get("url")}&site=${window.api.SITE}`,
  )

  return (
    <>
      <div>
        <div className="flex gap-6">
          {error
            ? "Couldn't fetch the episodes!"
            : !isLoading && (
                <>
                  <div className="w-56 space-y-4">
                    <img
                      className="rounded-md aspect-[9/12.8] object-cover"
                      src={data?.image}
                      alt={data?.title}
                    />
                    <div>
                      <ScrollArea className="w-full max-h-48 rounded-md border mb-6 overflow-auto">
                        <div className="p-4 h-full">
                          {data?.seasons.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                              <p>Não possui episódios!</p>
                            </div>
                          ) : (
                            data?.seasons.map((season, i) => (
                              <div key={i}>
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                  {season.title}
                                </h4>
                                {season.episodes.map((episode, i: number) => (
                                  <Link
                                    to={`/watch?url=${episode.url}&origin=${params.get("url")}&ep=${i + 1}`}
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
                    <small className="text-sm leading-none">{data?.description}</small>
                  </div>
                </>
              )}
        </div>
      </div>
    </>
  )
}
