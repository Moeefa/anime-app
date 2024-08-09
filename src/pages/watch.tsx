import React, { useContext, useEffect } from "react";

import Player from "@/components/player/player";
import { DataContext } from "@/contexts/data-context";
import { PlayerProvider } from "@/contexts/player-context";
import { SettingsContext } from "@/contexts/settings-context";
import { useLocation } from "react-router-dom";

export default function Home(): React.ReactElement {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { settings, update } = useContext(SettingsContext);
  const { data, sources } = useContext(DataContext);

  useEffect(() => {
    if (!data) return;

    if (!settings.recents.find((e) => e.url === params.get("url"))) {
      update("recents").set([
        {
          url: params.get("url"),
          origin: params.get("origin"),
          episode: data?.seasons[0].episodes.find(
            (_e, i) => i === Number(params.get("ep")) - 1,
          ),
          number: params.get("ep"),
          image: data?.image,
          title: data?.title,
          provider: settings.provider,
        },
        ...settings.recents,
      ]);
    }
  }, [data]);

  const playerData = {
    sources: sources?.urls || {},
    origin: params.get("origin") || "/",
    episode: Number(params.get("ep")) || 1,
    title: data?.title || "",
    next: {
      url: `/watch?url=${params
        .get("url")!
        .replace(
          params.get("ep")!,
          String(Number(params.get("ep")!) + 1),
        )}&origin=${params.get("origin")}&ep=${String(
        Number(params.get("ep")!) + 1,
      )}`,
      enabled: !!data?.seasons[0]?.episodes.find(
        (_e, i) => i === Number(params.get("ep")) + 1,
      ),
    },
  };

  return (
    <>
      <PlayerProvider>
        <div className="bg-black">
          <Player
            key={params
              .get("url")!
              .replace(
                params.get("ep")!,
                String(Number(params.get("ep")!) + 1),
              )}
            data={playerData}
          />
        </div>
      </PlayerProvider>
    </>
  );
}
