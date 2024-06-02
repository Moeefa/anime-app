interface ISearchItem {
  title: string;
  image: string;
  url: string;
  origin?: string;
  episode?: number;
}

interface ISearch {
  items: ISearchItem[];
  page: number;
  total: number;
  hasNext: boolean;
}

export type { ISearch, ISearchItem };
