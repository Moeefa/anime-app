import { createContext, useContext, useEffect, useState } from "react";

import { ISearch } from "@/types/search";
import { ProviderContext } from "@/contexts/provider-context";
import { useLocation } from "react-router-dom";
import { IAnime } from "@/types/anime";
import { IGetWatchURL } from "@/types/watch";
import { listen } from "@tauri-apps/api/event";

interface DataContextProps {
  popular: ISearch | null;
  search: ISearch | null;
  anime: IAnime | null;
  sources: IGetWatchURL | null;
  latest: {
    animes: ISearch | null;
    episodes: ISearch | null;
  };
}

const DEFAULT_DATA: DataContextProps = {
  popular: null,
  search: null,
  anime: null,
  sources: null,
  latest: {
    animes: null,
    episodes: null,
  },
};

export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { provider, status } = useContext(ProviderContext);
  const [data, setData] = useState<DataContextProps>(DEFAULT_DATA);

  async function listener() {
    await listen("refresh-data", async () => {
      setData(DEFAULT_DATA);

      if (status !== "online") return;

      const popular = await provider.popular();
      const animes = await provider.latestAnimes();
      const episodes = await provider.latestEpisodes();
      const search = await provider.search(params.get("q") || "");
      const sources = await provider.getWatchURL(params.get("url") || "");
      const anime = await provider.anime(
        (params.has("origin") ? params.get("origin") : params.get("url")) || "",
      );

      setData({
        popular,
        search,
        anime,
        sources,
        latest: { animes, episodes },
      });
    });
  }

  useEffect(() => {
    listener();
  }, []);

  useEffect(() => {
    setData(DEFAULT_DATA);

    if (status !== "online") return;

    (async () => {
      const popular = await provider.popular();
      const animes = await provider.latestAnimes();
      const episodes = await provider.latestEpisodes();

      setData((prev) => ({ ...prev, popular, latest: { animes, episodes } }));
    })();
  }, [provider, status]);

  useEffect(() => {
    setData((prev) => ({ ...prev, search: null }));

    if (status !== "online") return;

    (async () => {
      const search = await provider.search(params.get("q") || "");

      setData((prev) => ({ ...prev, search }));
    })();
  }, [provider, status, params.get("q")]);

  useEffect(() => {
    setData((prev) => ({ ...prev, anime: null, sources: null }));

    if (status !== "online") return;

    (async () => {
      const anime = await provider.anime(
        (params.has("origin") ? params.get("origin") : params.get("url")) || "",
      );
      const sources = await provider.getWatchURL(params.get("url") || "");

      setData((prev) => ({ ...prev, anime, sources }));
    })();
  }, [provider, status, params.get("url"), params.get("origin")]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
