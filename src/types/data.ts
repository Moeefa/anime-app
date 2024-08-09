interface Data {
  title: string;
  image: string;
  tags: string[];
  description: string;
  year: number;
  rating: number;
  seasons: Season[];
  related: Related[] | null;
}

interface Season {
  title: string;
  episodes: Episode[];
}

interface Related {
  title: string;
  image: string;
  url: string;
}

interface Episode {
  title: string;
  url: string;
  image?: string;
}

export type { Data, Episode, Related, Season };

