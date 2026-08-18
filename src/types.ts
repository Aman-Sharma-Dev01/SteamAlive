export interface SystemRequirementSpecs {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directx: string;
  storage?: string;
  soundCard?: string;
  additionalNotes?: string;
}

export interface SystemRequirements {
  minimum: SystemRequirementSpecs;
  recommended: SystemRequirementSpecs;
}

export interface Screenshot {
  url: string;
  caption?: string;
  alt: string;
  isWide?: boolean;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  coverImage: string;
  bannerImage?: string;
  rating: number; // 0 - 100
  metascore: number; // 0 - 100
  releaseYear: number;
  releaseDate: string;
  genres: string[];
  primaryGenre: string;
  platforms: string[];
  developer: string;
  publisher: string;
  storageRequired: string;
  storageGb: number;
  minRamGb: number;
  recRamGb: number;
  description: string;
  aboutParagraphs: string[];
  screenshots: Screenshot[];
  systemRequirements: SystemRequirements;
  isTrending?: boolean;
  isPopular?: boolean;
  popularIcon?: string;
  storeUrl?: string;
  steamAppId?: string;
}

export type NavTab = 'explore' | 'library' | 'compare' | 'profile' | 'search';

export type GameStatus = 'want_to_play' | 'playing' | 'completed' | 'dropped';

export interface LibraryItem {
  gameId: string;
  status: GameStatus;
  isFavorite: boolean;
  rating?: number;
  userNotes?: string;
  hoursPlayed?: number;
  addedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedGenres: string[];
  minMetascore: number;
  releaseYearRange: [number, number];
  platform: string;
  sortBy: 'popularity' | 'metascore' | 'releaseDate' | 'title';
}

export interface UserPcSpecs {
  os: string;
  cpu: string;
  ramGb: number;
  gpu: string;
  vramGb: number;
  directx: number;
  freeStorageGb: number;
}
