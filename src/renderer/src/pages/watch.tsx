import { IAnime } from "src/types/anime"
import { IGetWatchURL } from "src/types/watch"
import Player from "@/components/player"
import React from "react"
import { useLocation } from "react-router-dom"
import useSWR from "swr"

export default function Home(): React.ReactElement {
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  // eslint-disable-next-line prettier/prettier
  const { data, error, isLoading }: { data: IAnime | undefined; error: unknown; isLoading: boolean } = useSWR(`${window.api.URL}/anime?url=${params.get("origin")}&site=${window.api.SITE}`,)
  // eslint-disable-next-line prettier/prettier
  const { data: src }: { data: IGetWatchURL | undefined } = useSWR(`${window.api.URL}/watch/url?url=${params.get("url")}&site=${window.api.SITE}`)

  console.log(data?.seasons[0].episodes[-1])

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-black">
        <Player
          key={params.get("url")!.replace(params.get("ep")!, String(Number(params.get("ep")!) + 1))}
          data-origin={params.get("origin")!}
          data-episode={params.get("ep")!}
          data-next={`/watch?url=${params.get("url")!.replace(params.get("ep")!, String(Number(params.get("ep")!) + 1))}&origin=${params.get("origin")}&ep=${String(Number(params.get("ep")!) + 1)}`}
          data-title={!error && !isLoading ? data?.title || "" : ""}
          src={src?.url || ""}
        />
      </div>
    </>
  )
}
