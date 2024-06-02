import { IAnime } from "@/types/anime";
import { IGetWatchURL } from "@/types/watch";
import { ISearch } from "@/types/search";

abstract class Engine {
  name: string;
  url: string;
  deprecated: boolean = false;
  headers: HeadersInit = {};

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;

    this.headers = {
      origin: this.url,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Access-Control-Allow-Origin": "*",
    };
  }

  removeBaseUrl(url?: string): string {
    return url?.replace(this.url, "") ?? "";
  }

  getQualities(src: string) {
    const qualities = ["fhd", "hd", "sd"];
    return qualities
      .map((v, i) => {
        if (/(480p|sd)/g.test(src) && v === "hd") return;
        if (/(720p|hd)/g.test(src) && v === "fhd") return;

        if (/(1080p|720p|480p)/g.test(src)) {
          return src.replace(/1080p|720p|480p/g, ["1080p", "720p", "480p"][i]);
        } else {
          return src.replace(/fhd|hd|sd/g, ["fhd", "hd", "sd"][i]);
        }
      })
      .reduce(
        (acc, cur, i) => (cur ? { ...acc, [qualities[i]]: cur } : {}),
        {}
      );
  }

  abstract latestAnimes(page?: number): Promise<ISearch>;
  abstract latestEpisodes(page?: number): Promise<ISearch>;
  abstract popular(page?: number): Promise<ISearch>;
  abstract search(query: string): Promise<ISearch>;
  abstract anime(url: string): Promise<IAnime>;
  abstract getWatchURL(
    url: string,
    response?: Response
  ): Promise<IGetWatchURL | null>;
}

export { Engine };
