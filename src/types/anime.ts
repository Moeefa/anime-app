interface IAnime {
  title: string;
  image: string;
  tags: string[];
  description: string;
  year: number;
  rating: number;
  seasons: ISeason[];
  related: IRelated[] | null;
}

interface ISeason {
  title: string;
  episodes: IEpisode[];
}

interface IRelated {
  title: string;
  image: string;
  url: string;
}

interface IEpisode {
  title: string;
  url: string;
  image?: string;
}

export type { IAnime, ISeason, IEpisode };
