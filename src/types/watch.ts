import { Readable } from "stream";

interface Watch {
  headers: object;
  stream: Readable | null;
}

interface WatchURL {
  urls: { [index: string]: string };
}

export type { Watch, WatchURL };
