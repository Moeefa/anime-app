import React, { useContext, useEffect } from "react";

import Player from "@/components/player";
import { PlayerProvider } from "@/contexts/player-context";
import { SettingsContext } from "@/contexts/settings-context";
import { useLocation } from "react-router-dom";
import { DataContext } from "@/contexts/data-context";

export default function Home(): React.ReactElement {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { settings, update } = useContext(SettingsContext);
  const data = useContext(DataContext);

  useEffect(() => {
    (async () => {
      if (!data) return;
      if (!settings.recents.find((e) => e.url === params.get("url"))) {
        update("recents").set([
          {
            url: params.get("url"),
            origin: params.get("origin"),
            episode: data.anime?.seasons[0].episodes.find(
              (_e, i) => i === Number(params.get("ep")) - 1,
            ),
            number: params.get("ep"),
            image: data.anime?.image,
            title: data.anime?.title,
            provider: settings.provider,
          },
          ...settings.recents,
        ]);
      }
    })();
  }, [data]);

  return (
    <>
      <PlayerProvider>
        <div className="h-screen w-screen overflow-hidden flex bg-black">
          <Player
            key={params
              .get("url")!
              .replace(
                params.get("ep")!,
                String(Number(params.get("ep")!) + 1),
              )}
            sources={data.sources?.urls || {}}
            data-origin={params.get("origin") || "/"}
            data-episode={params.get("ep") || 1}
            data-next={`/watch?url=${params
              .get("url")!
              .replace(
                params.get("ep")!,
                String(Number(params.get("ep")!) + 1),
              )}&origin=${params.get("origin")}&ep=${String(
              Number(params.get("ep")!) + 1,
            )}`}
            data-title={data.anime?.title || ""}
            data-disable-next={
              data.anime?.seasons[0]?.episodes.at(-1)?.url === params.get("url")
            }
          />
        </div>
      </PlayerProvider>
    </>
  );
}
