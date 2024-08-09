import { createContext, useContext, useEffect, useState } from "react";

import { ProviderContext } from "@/contexts/provider-context";
import { Data } from "@/types/data";
import { Search } from "@/types/search";
import { WatchURL } from "@/types/watch";
import { listen } from "@tauri-apps/api/event";
import { useLocation } from "react-router-dom";

interface DataContextProps {
  popular: Search | null;
  search: Search | null;
  data: Data | null;
  sources: WatchURL | null;
  latest: {
    releases: Search | null;
    episodes: Search | null;
  };
}

const DEFAULT_DATA: DataContextProps = {
  popular: null,
  search: null,
  data: null,
  sources: null,
  latest: {
    releases: null,
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
      const releases = await provider.latestReleases();
      const episodes = await provider.latestEpisodes();
      const search = await provider.search(params.get("q") || "");
      const sources = await provider.getWatchURL(params.get("url") || "");
      const data = await provider.getData(
        (params.has("origin") ? params.get("origin") : params.get("url")) || "",
      );

      setData({
        popular,
        search,
        data,
        sources,
        latest: { releases, episodes },
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
      const releases = await provider.latestReleases();
      const episodes = await provider.latestEpisodes();

      setData((prev) => ({ ...prev, popular, latest: { releases, episodes } }));
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
    setData((prev) => ({ ...prev, data: null, sources: null }));

    if (status !== "online") return;

    (async () => {
      const data = await provider.getData(
        (params.has("origin") ? params.get("origin") : params.get("url")) || "",
      );
      const sources = await provider.getWatchURL(params.get("url") || "");

      setData((prev) => ({ ...prev, data, sources }));
    })();
  }, [provider, status, params.get("url"), params.get("origin")]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
