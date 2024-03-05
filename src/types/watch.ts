import { Readable } from "stream";

interface IWatch {
  headers: object;
  stream: Readable | null;
}

interface IGetWatchURL {
  sources: { [index: string]: string };
}

export type { IWatch, IGetWatchURL };
