import type { Data, Season } from "@/types/data";
import type { Search, SearchItem } from "@/types/search";
import type { WatchURL } from "@/types/watch";

import { Engine } from "@/lib/engine";
import { removeBaseURL, retryPromise } from "@/lib/utils";
import { fetch } from "@tauri-apps/plugin-http";
import { load } from "cheerio";

export default class AnimeFire extends Engine {
  constructor() {
    super("AnimeFire", "https://animefire.plus");
  }

  async latestReleases(page: number = 1): Promise<Search> {
    const search = load(
      await fetch(`${this.url}/em-lancamento/${page}`, {
        method: "GET",
        headers: this.headers,
      }).then(async (res) => await res.text()),
    );

    const items = search("div.divCardUltimosEps")
      .toArray()
      .map<SearchItem>((item) => ({
        title: search(item).find(".animeTitle").text().trim(),
        image: search(item).find(".imgAnimes").attr("data-src") ?? "",
        url: search(item).find("a").attr("href")?.replace(this.url, "") ?? "",
      }));

    const currentPage = Number(search(".pagination .text-info").text().trim());
    const hasNext = search(".anTProLi span").text().includes("Próxima");
    const totalPages = -1;

    return {
      items,
      page: currentPage,
      hasNext,
      total: totalPages,
    };
  }

  async latestEpisodes(page: number = 1): Promise<Search> {
    const search = load(
      await fetch(`${this.url}/home/${page}`, {
        method: "GET",
        headers: this.headers,
      }).then(async (res) => await res.text()),
    );

    const items = search("div.divCardUltimosEpsHome")
      .toArray()
      .map<SearchItem>((item) => ({
        title: search(item).find(".animeTitle").text().trim(),
        image: search(item).find(".imgAnimesUltimosEps").attr("data-src") ?? "",
        url: search(item).find("a").attr("href")?.replace(this.url, "") ?? "",
        origin: `${search(item)
          .find("a")
          .attr("href")
          ?.replace(this.url, "")
          .slice(
            0,
            search(item)
              .find("a")
              .attr("href")
              ?.replace(this.url, "")
              .lastIndexOf("/"),
          )}-todos-os-episodios`,
        episode: Number(
          search(item)
            .find("a")
            .attr("href")
            ?.replace(this.url, "")
            .split("/")
            .pop(),
        ),
      }));

    const currentPage = Number(search(".pagination .text-info").text().trim());
    const hasNext = search(".page-link")
      .toArray()
      .some((a) => search(a).text().includes("Próximo"));
    const totalPages = -1;

    return {
      items,
      page: currentPage,
      hasNext,
      total: totalPages,
    };
  }

  async popular(): Promise<Search> {
    const search = load(
      await fetch(`${this.url}/top-animes`, {
        method: "GET",
        headers: this.headers,
      }).then(async (res) => await res.text()),
    );

    const items = search("div.divCardUltimosEps")
      .toArray()
      .map<SearchItem>((item) => ({
        title: search(item).find(".animeTitle").text().trim(),
        image: search(item).find(".imgAnimes").attr("data-src") ?? "",
        url: search(item).find("a").attr("href")?.replace(this.url, "") ?? "",
      }));

    const currentPage = Number(search(".pagination .text-info").text().trim());
    const hasNext = search(".page-link")
      .toArray()
      .some((a) => search(a).text().includes("Próxima"));
    const totalPages = -1;

    return {
      items,
      page: currentPage,
      hasNext,
      total: totalPages,
    };
  }

  async search(query: string): Promise<Search> {
    const search = load(
      await fetch(`${this.url}/pesquisar/${query}`, {
        method: "GET",
        headers: this.headers,
      }).then(async (res) => await res.text()),
    );

    const items = search("div.divCardUltimosEps")
      .toArray()
      .map((item) => ({
        title: search(item).find(".animeTitle").text().trim(),
        image: search(item).find(".imgAnimes").attr("data-src") ?? "",
        url: search(item).find("a").attr("href")?.replace(this.url, "") ?? "",
      }));

    return {
      items,
      page: 1,
      hasNext: false,
      total: 1,
    };
  }

  @removeBaseURL
  async getData(address: string): Promise<Data> {
    const search = load(
      await fetch(`${this.url}/${address}`, {
        method: "GET",
        headers: this.headers,
      }).then(async (res) => await res.text()),
    );

    const title = search(".main_div_anime_info h1")
      .text()
      .replace("Todos os Episodios Online", "")
      .trim();
    const image = search(".divMainNomeAnime img").attr("data-src") ?? "";
    const tags = search(".animeInfo a")
      .toArray()
      .map((tag) => search(tag).text().trim());

    const allAnimeInfo = search(".animeInfo")
      .toArray()
      .map((info) => ({
        type: search(info).find("b").text().trim(),
        value: search(info).find("span").text().trim(),
      }));

    const description = search(".divSinopse .spanAnimeInfo").text().trim();
    const year = Number(
      allAnimeInfo.find((info) => info.type.includes("Ano"))?.value ?? "",
    );
    const rating = Number(search("#anime_score").text().trim());

    const seasons = search(".div_video_list")
      .toArray()
      .map<Season>((season) => {
        const title = "Episódios";
        const episodes = search(season)
          .find("a")
          .toArray()
          .map((episode) => {
            const title = search(episode).text().trim();
            const url =
              search(episode).attr("href")?.replace(this.url, "") || this.url;
            const image = "";

            return { title, url, image };
          });

        return {
          title,
          episodes,
        };
      });

    const related = search(".owl-carousel-anime .owl-item")
      .toArray()
      .map((anime) => {
        const title = search(anime).find(".item").attr("alt") ?? "";
        const url =
          search(anime).find("a").attr("href")?.replace(this.url, "") || "";
        const image = search(anime).find(".item img").attr("src") ?? "";
        return { title, url, image };
      });

    return {
      title,
      image,
      tags,
      description,
      year,
      rating,
      seasons,
      related,
    };
  }

  async getWatchURL(address: string): Promise<WatchURL | null> {
    const search = load(
      await retryPromise(
        () =>
          fetch(`${this.url}/${decodeURIComponent(address).replace("/", "")}`, {
            method: "GET",
            headers: this.headers,
          }),
        {
          retryIf: (res) => res.ok,
          retries: 3,
        },
      ).then(async (res) => await res.text()),
    );

    const videoDataLink = search("video").attr("data-video-src");

    if (!videoDataLink) return null;

    const res = await retryPromise(
      () =>
        fetch(videoDataLink, {
          method: "GET",
          headers: this.headers,
        }),
      {
        retryIf: (res) => res.ok,
        retries: 3,
      },
    );
    const { data } = await res.json();

    return {
      urls: data.reduce((acc: any, cur: any) => {
        const { label, src } = cur;
        return {
          ...acc,
          [label]: src,
        };
      }, {}),
    };
  }
}
