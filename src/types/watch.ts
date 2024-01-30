import { Readable } from "stream"

interface IWatch {
  headers: object
  stream: Readable | null
}

interface IGetWatchURL {
  url: string
}

export type { IWatch, IGetWatchURL }
