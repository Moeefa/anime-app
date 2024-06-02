import { IGetWatchURL } from "../../types/watch";

import { Engine } from "../engine";
import { IAnime } from "../../types/anime";
import { ISearch } from "../../types/search";
import { fetch } from "@tauri-apps/plugin-http";

export default class AnimePlus extends Engine {
  constructor() {
    super("AnimePlus", "https://animeland.appanimeplus.tk/videoweb");
  }

  async latestAnimes(page: number = 1): Promise<ISearch> {
    return {
      items: [],
      page,
      hasNext: false,
      total: 1,
    };
  }

  async latestEpisodes(page: number = 1): Promise<ISearch> {
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

  async popular(): Promise<ISearch> {
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

  async search(query: string): Promise<ISearch> {
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

  async anime(address: string): Promise<IAnime> {
    const res = await fetch(this.url + this.removeBaseUrl(address), {
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

  async getWatchURL(address: string): Promise<IGetWatchURL | null> {
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
