import { Data } from "@/types/data";
import { Search } from "@/types/search";
import { WatchURL } from "@/types/watch";

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
        {},
      );
  }

  abstract latestReleases(page?: number): Promise<Search>;
  abstract latestEpisodes(page?: number): Promise<Search>;
  abstract popular(page?: number): Promise<Search>;
  abstract search(query: string): Promise<Search>;
  abstract getData(url: string): Promise<Data>;
  abstract getWatchURL(
    url: string,
    response?: Response,
  ): Promise<WatchURL | null>;
}

export { Engine };
