interface ISearchItem {
  title: string
  image: string
  url: string
}

interface ISearch {
  items: ISearchItem[]
  page: number
  total: number
  hasNext: boolean
}

export type { ISearch, ISearchItem }
