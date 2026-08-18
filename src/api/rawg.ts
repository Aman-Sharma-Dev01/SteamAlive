import { Game, Screenshot } from '../types';

const API_KEY = '7a98e87207e04de5b5ef2f96718c3671';
const BASE_URL = 'https://api.rawg.io/api';

export interface RawgGenre {
  id: number;
  name: string;
  slug: string;
}

export interface RawgPlatformEntry {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at: string;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
}

export interface RawgScreenshot {
  id: number;
  image: string;
  is_deleted: boolean;
}

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  genres: RawgGenre[];
  platforms: RawgPlatformEntry[];
  short_screenshots: RawgScreenshot[];
}

export interface RawgGameDetail extends RawgGame {
  description: string;
  description_raw: string;
  website: string;
  reddit_url: string;
  metacritic_url: string;
  esrb_rating: { id: number; name: string; slug: string } | null;
  stores: { store: { id: number; name: string; slug: string } }[];
}

export interface RawgMovie {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}

export interface RawgResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

export interface RawgScreenshotResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgScreenshot[];
}

export interface RawgMovieResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgMovie[];
}

function parsePlatformRequirements(reqs?: { minimum?: string; recommended?: string }): {
  minimum: { os: string; processor: string; memory: string; graphics: string; directx: string; storage: string };
  recommended: { os: string; processor: string; memory: string; graphics: string; directx: string; storage: string };
} {
  const blank = { os: 'N/A', processor: 'N/A', memory: 'N/A', graphics: 'N/A', directx: 'N/A', storage: 'N/A' };

  if (!reqs) return { minimum: { ...blank }, recommended: { ...blank } };

  const parseLine = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const result: Record<string, string> = { os: '', processor: '', memory: '', graphics: '', directx: '', storage: '' };
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith('os:')) result.os = line.slice(3).trim();
      else if (lower.startsWith('processor:') || lower.startsWith('cpu:')) result.processor = line.split(':').slice(1).join(':').trim();
      else if (lower.startsWith('memory:') || lower.startsWith('ram:')) result.memory = line.split(':').slice(1).join(':').trim();
      else if (lower.startsWith('graphics:') || lower.startsWith('gpu:')) result.graphics = line.split(':').slice(1).join(':').trim();
      else if (lower.startsWith('directx:')) result.directx = line.slice(8).trim();
      else if (lower.startsWith('storage:') || lower.includes('available space')) result.storage = line.split(':').slice(1).join(':').trim();
    }
    return result;
  };

  const min = parseLine(reqs.minimum || '');
  const rec = parseLine(reqs.recommended || '');

  return {
    minimum: { ...blank, ...min },
    recommended: { ...blank, ...rec },
  };
}

function extractRamGb(reqs?: { minimum?: string; recommended?: string }): { min: number; rec: number } {
  if (!reqs) return { min: 0, rec: 0 };
  const extract = (text: string) => {
    const match = text.match(/(\d+)\s*GB\s*(RAM|of RAM|memory)/i);
    return match ? parseInt(match[1]) : 0;
  };
  return {
    min: extract(reqs.minimum || ''),
    rec: extract(reqs.recommended || ''),
  };
}

function extractStorageGb(reqs?: { minimum?: string; recommended?: string }): number {
  if (!reqs?.minimum) return 0;
  const match = reqs.minimum.match(/(\d+)\s*GB\s*(available|space|SSD|storage)/i);
  return match ? parseInt(match[1]) : 0;
}

function findSteamStore(stores: { store: { id: number; name: string; slug: string } }[]): string | undefined {
  const steam = stores?.find(s => s.store.id === 1);
  if (steam) {
    return `https://store.steampowered.com/`;
  }
  return undefined;
}

export function mapRawgToGame(rawg: RawgGame): Game {
  return {
    id: String(rawg.id),
    slug: rawg.slug,
    title: rawg.name,
    tagline: undefined,
    coverImage: rawg.background_image || '',
    bannerImage: rawg.background_image || '',
    rating: Math.round(rawg.rating * 20),
    metascore: rawg.metacritic || 0,
    releaseYear: rawg.released ? new Date(rawg.released).getFullYear() : 0,
    releaseDate: rawg.released
      ? new Date(rawg.released).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'TBA',
    genres: rawg.genres.map(g => g.name),
    primaryGenre: rawg.genres[0]?.name || 'Unknown',
    platforms: rawg.platforms.map(p => p.platform.name),
    developer: '',
    publisher: '',
    storageRequired: 'N/A',
    storageGb: 0,
    minRamGb: 0,
    recRamGb: 0,
    description: '',
    aboutParagraphs: [],
    screenshots: [],
    systemRequirements: {
      minimum: { os: 'N/A', processor: 'N/A', memory: 'N/A', graphics: 'N/A', directx: 'N/A', storage: 'N/A' },
      recommended: { os: 'N/A', processor: 'N/A', memory: 'N/A', graphics: 'N/A', directx: 'N/A', storage: 'N/A' },
    },
    isTrending: rawg.rating >= 4.0,
    isPopular: rawg.playtime > 10,
  };
}

export async function fetchTrendingGames(pageSize = 20): Promise<Game[]> {
  const res = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&page_size=${pageSize}&ordering=-rating&platforms=4`
  );
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);
  const data: RawgResponse = await res.json();
  return data.results.map(mapRawgToGame);
}

export async function searchGames(query: string, pageSize = 20, page = 1): Promise<{ games: Game[]; totalCount: number }> {
  const res = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=${pageSize}&page=${page}&platforms=4`
  );
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);
  const data: RawgResponse = await res.json();
  return {
    games: data.results.map(mapRawgToGame),
    totalCount: data.count,
  };
}

export async function fetchGameById(gameId: string): Promise<Game | null> {
  const res = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
  if (!res.ok) return null;
  const rawg: RawgGameDetail = await res.json();

  const pcPlatform = rawg.platforms.find(p => p.platform.id === 4);
  const reqs = pcPlatform?.requirements;
  const ram = extractRamGb(reqs);
  const storageGb = extractStorageGb(reqs);
  const systemReqs = parsePlatformRequirements(reqs);

  const developers = (rawg as any).developers;
  const publishers = (rawg as any).publishers;

  return {
    id: String(rawg.id),
    slug: rawg.slug,
    title: rawg.name,
    tagline: undefined,
    coverImage: rawg.background_image || '',
    bannerImage: rawg.background_image || '',
    rating: Math.round(rawg.rating * 20),
    metascore: rawg.metacritic || 0,
    releaseYear: rawg.released ? new Date(rawg.released).getFullYear() : 0,
    releaseDate: rawg.released
      ? new Date(rawg.released).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'TBA',
    genres: rawg.genres.map(g => g.name),
    primaryGenre: rawg.genres[0]?.name || 'Unknown',
    platforms: rawg.platforms.map(p => p.platform.name),
    developer: developers?.length ? developers.map((d: any) => d.name).join(', ') : '',
    publisher: publishers?.length ? publishers.map((p: any) => p.name).join(', ') : '',
    storageRequired: storageGb > 0 ? `${storageGb} GB` : 'N/A',
    storageGb,
    minRamGb: ram.min,
    recRamGb: ram.rec,
    description: rawg.description_raw || '',
    aboutParagraphs: rawg.description_raw
      ? rawg.description_raw.split('\n\n').filter(p => p.trim().length > 0).slice(0, 4)
      : [],
    screenshots: [],
    systemRequirements: systemReqs,
    isTrending: rawg.rating >= 4.0,
    isPopular: rawg.playtime > 10,
    storeUrl: rawg.website || findSteamStore(rawg.stores),
  };
}

export async function fetchGameScreenshots(gameId: string): Promise<Screenshot[]> {
  const res = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}&page_size=10`);
  if (!res.ok) return [];
  const data: RawgScreenshotResponse = await res.json();
  return data.results.map((s, idx) => ({
    url: s.image,
    alt: `Screenshot ${idx + 1}`,
    isWide: idx === 0,
    caption: '',
  }));
}

export async function fetchGameTrailers(gameId: string): Promise<{ name: string; preview: string; videoUrl: string }[]> {
  const res = await fetch(`${BASE_URL}/games/${gameId}/movies?key=${API_KEY}`);
  if (!res.ok) return [];
  const data: RawgMovieResponse = await res.json();
  return data.results.map(m => ({
    name: m.name,
    preview: m.preview,
    videoUrl: m.data.max || m.data[480],
  }));
}

export async function fetchGamesByIds(ids: string[]): Promise<Game[]> {
  const results = await Promise.allSettled(ids.map(id => fetchGameById(id)));
  return results
    .filter((r): r is PromiseFulfilledResult<Game | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((g): g is Game => g !== null);
}
