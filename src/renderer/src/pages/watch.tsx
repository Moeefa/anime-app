import React, { useEffect } from "react";

import { IAnime } from "src/types/anime";
import { IGetWatchURL } from "src/types/watch";
import Player from "@/components/player";
import { PlayerProvider } from "@/contexts/player-context";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

export default function Home(): React.ReactElement {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  console.log(location.search);

  const { data, error, isLoading } = useSWR<IAnime>(
    `${window.api.BASE_URL}/anime?url=${encodeURIComponent(params.get("origin")!)}&site=${window.storage.get("settings.provider") || window.api.PROVIDER}`
  );

  console.log(data);

  const { data: src } = useSWR<IGetWatchURL>(
    `${window.api.BASE_URL}/watch/url?url=${encodeURIComponent(params.get("url")!)}&site=${window.storage.get("settings.provider") || window.api.PROVIDER}`
  );

  useEffect(() => {
    if (
      !((window.storage.get("recents.episodes") as []) || []).find(
        (e: { url: string; origin: string; episode: string }) =>
          e.url === params.get("url")
      ) &&
      !error &&
      !isLoading
    ) {
      window.storage.set("recents.episodes", [
        {
          url: params.get("url"),
          origin: params.get("origin"),
          episode: data?.seasons[0].episodes.find(
            (e, i) => i === Number(params.get("ep")) - 1
          ),
          number: params.get("ep"),
          image: data?.image,
          title: data?.title,
          provider:
            window.storage.get("settings.provider") || window.api.PROVIDER,
        },
        ...((window.storage.get("recents.episodes") as []) || []),
      ]);
    }
  }, []);

  return (
    <>
      <PlayerProvider>
        <div className="h-screen w-screen overflow-hidden flex justify-center items-center bg-black">
          <Player
            key={params
              .get("url")!
              .replace(
                params.get("ep")!,
                String(Number(params.get("ep")!) + 1)
              )}
            sources={src?.sources || {}}
            data-origin={params.get("origin") || "/"}
            data-episode={params.get("ep") || 1}
            data-next={`/watch?url=${params.get("url")!.replace(params.get("ep")!, String(Number(params.get("ep")!) + 1))}&origin=${params.get("origin")}&ep=${String(Number(params.get("ep")!) + 1)}`}
            data-title={!error && !isLoading ? data?.title || "" : ""}
            data-disable-next={
              data?.seasons[0].episodes.at(-1)?.url === params.get("url")
            }
          />
        </div>
      </PlayerProvider>
    </>
  );
}
