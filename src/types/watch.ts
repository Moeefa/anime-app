import { Readable } from "stream";

interface IWatch {
  headers: object;
  stream: Readable | null;
}

interface IGetWatchURL {
  urls: { [index: string]: string };
}

export type { IGetWatchURL, IWatch };
