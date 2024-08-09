import type { Data } from "@/types/data";
import type { Search } from "@/types/search";
import type { WatchURL } from "../../types/watch";

import { Engine } from "@/lib/engine";
import { removeBaseURL } from "@/lib/utils";
import { fetch } from "@tauri-apps/plugin-http";

export default class AnimePlus extends Engine {
  constructor() {
    super("AnimePlus", "https://animeland.appanimeplus.tk/videoweb");
  }

  async latestReleases(page: number = 1): Promise<Search> {
    return {
      items: [],
      page,
      hasNext: false,
      total: 1,
    };
  }

  async latestEpisodes(page: number = 1): Promise<Search> {
    const res = await fetch(`${this.url}/api.php?action=latestvideos`, {
      method: "GET",
      headers: this.headers,
    });
    const data = await res.text();

    const items = JSON.parse(data.slice(0, data.length - 1)).map(
      (item: any) => ({
        title: item.title,
        image: `https://cdn.appanimeplus.tk/img/${item.image}`,
        url: item.location,
      }),
    );

    return {
      items,
      page,
      hasNext: false,
      total: 1,
    };
  }

  async popular(): Promise<Search> {
    const res = await fetch(
      `${this.url}/api.php?action=trendingcategory&items=10`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    const data = await res.json();

    const items = data.map((item: any) => ({
      title: item.category_name,
      image: `https://cdn.appanimeplus.tk/img/${item.category_icon}`,
      url: `/api.php?action=viewcategory&categoryid=${item.id}`,
    }));

    return {
      items,
      page: 1,
      hasNext: false,
      total: -1,
    };
  }

  async search(query: string): Promise<Search> {
    const res = await fetch(
      `${this.url}/api.php?action=searchvideo&searchword=${query}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    const data = await res.json();

    const items = data.map((item: any) => ({
      title: item.category_name,
      image: `https://cdn.appanimeplus.tk/img/${item.category_icon}`,
      url: `/api.php?action=viewcategory&categoryid=${item.category_id}`,
    }));

    return {
      items: data[0].response === "No results found" ? [] : items,
      page: 1,
      hasNext: false,
      total: 1,
    };
  }

  @removeBaseURL
  async getData(address: string): Promise<Data> {
    const res = await fetch(this.url + address, {
      method: "GET",
      headers: this.headers,
    });
    const data = await res.json();

    const video = await (
      await fetch(
        `${this.url}/api.php?action=category_videos&category_id=${data[0].category_id}`,
        {
          method: "GET",
          headers: this.headers,
        },
      )
    ).json();

    return {
      title: data[0].category_name,
      image: `https://cdn.appanimeplus.tk/img/${data[0].category_icon}`,
      tags: data[0].genres?.split(", "),
      description: data[0].category_desc,
      year: data[0].ano,
      rating: -1,
      seasons: [
        {
          title: "Episódios",
          episodes: video.map((item: any) => ({
            title: item.title,
            url: item.location,
            image: "",
          })),
        },
      ],
      related: null,
    };
  }

  async getWatchURL(address: string): Promise<WatchURL | null> {
    try {
      const hd = new URL(address);
      hd.searchParams.set("qh", "hd");

      return {
        urls: {
          SD: address,
          HD: hd.href,
        },
      };
    } catch (e) {
      return null;
    }
  }
}
