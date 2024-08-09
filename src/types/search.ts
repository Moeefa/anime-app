interface SearchItem {
  title: string;
  image: string;
  url: string;
  origin?: string;
  episode?: number;
}

interface Search {
  items: SearchItem[];
  page: number;
  total: number;
  hasNext: boolean;
}

export type { Search, SearchItem };
