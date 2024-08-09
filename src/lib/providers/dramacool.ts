import type { Data } from "@/types/data";
import type { Search } from "@/types/search";
import type { WatchURL } from "@/types/watch";

import { Engine } from "@/lib/engine";
import { removeBaseURL } from "@/lib/utils";
import { fetch } from "@tauri-apps/plugin-http";

export default class Dramacool extends Engine {
  constructor() {
    super("Dramacool", "https://consumet-jade.vercel.app");
  }

  async latestReleases(page: number = 1): Promise<Search> {
    const res = await fetch(`https://dramacool-scraper.vercel.app/recent`, {
      method: "GET",
      headers: this.headers,
    });
    const { results } = await res.json();

    const items = results.map((item: any) => ({
      title: item.title,
      image: item.image,
      url: item.id,
    }));

    return {
      items,
      page,
      hasNext: false,
      total: 1,
    };
  }

  async latestEpisodes(page: number = 1): Promise<Search> {
    return {
      items: [],
      page,
      hasNext: false,
      total: 1,
    };
  }

  async popular(): Promise<Search> {
    const res = await fetch(`https://dramacool-scraper.vercel.app/popular`, {
      method: "GET",
      headers: this.headers,
    });
    const { results } = await res.json();

    const items = results.map((item: any) => ({
      title: item.title,
      image: item.image,
      url: item.id,
    }));

    return {
      items,
      page: 1,
      hasNext: false,
      total: -1,
    };
  }

  async search(query: string): Promise<Search> {
    const res = await fetch(`${this.url}/movies/dramacool/${query}?page=1`, {
      method: "GET",
      headers: this.headers,
    });
    const data = await res.json();

    return {
      items:
        data.results?.map((item: any) => ({
          title: item.title,
          image: item.image,
          url: item.id,
        })) || [],
      page: Number(data.currentPage) || 1,
      hasNext: data.hasNextPage,
      total: data.totalPages,
    };
  }

  @removeBaseURL
  async getData(address: string): Promise<Data> {
    const res = await fetch(`${this.url}/movies/dramacool/info?id=${address}`, {
      method: "GET",
      headers: this.headers,
    });

    const data = await res.json();

    return {
      title: data.title,
      image: data.image,
      tags: [],
      description: data.description,
      year: -1,
      rating: -1,
      seasons: data.episodes
        ? [
            {
              title: "Episodes",
              episodes: data.episodes.map((episode: any) => ({
                title: episode.title,
                url: `episodeId=${episode.id}&mediaId=${data.id.replace("/", "")}`,
              })),
            },
          ]
        : [],
      related: null,
    };
  }

  async getWatchURL(address: string): Promise<WatchURL | null> {
    const res = await fetch(`${this.url}/movies/dramacool/watch?${address}`, {
      method: "GET",
      headers: this.headers,
    });

    const data = await res.json();

    return {
      urls: {
        "Option 1": data.sources?.at(0).url,
      },
      // urls: data.sources?.reduce(
      //   (acc: any, item: any, i: number) =>
      //     Object.assign(acc, { [`Option ${i + 1}`]: item.url }),
      //   {},
      // ),
    };
  }
}
