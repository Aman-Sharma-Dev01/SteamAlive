import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../types';
import { GENRE_LIST } from '../data/games';
import { searchGames } from '../api/rawg';

interface SearchViewProps {
  initialQuery?: string;
  initialGenre?: string;
  onSelectGame: (gameId: string) => void;
  onOpenCmdK: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  initialGenre = '',
  onSelectGame,
  onOpenCmdK
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || 'All Genres');
  const [minMetascore, setMinMetascore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'metascore' | 'year' | 'title'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const performSearch = useCallback(async (query: string, pageNum: number, append: boolean) => {
    try {
      setLoading(true);
      const sortParam = sortBy === 'metascore' ? '-metacritic' :
                        sortBy === 'year' ? '-released' :
                        sortBy === 'title' ? 'name' :
                        '-rating';
      const effectiveQuery = query || '';
      const { games: results, totalCount: count } = await searchGames(effectiveQuery, 18, pageNum);
      if (append) {
        setGames(prev => [...prev, ...results]);
      } else {
        setGames(results);
      }
      setTotalCount(count);
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialGenre) {
      setSelectedGenre(initialGenre);
    }
  }, [initialGenre]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      performSearch(searchQuery, 1, false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    setPage(1);
    performSearch(searchQuery, 1, false);
  }, [sortBy, performSearch]);

  const filteredGames = games.filter((game) => {
    const matchesGenre =
      selectedGenre === 'All Genres' ||
      game.primaryGenre.toLowerCase() === selectedGenre.toLowerCase() ||
      game.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
    const matchesScore = game.metascore >= minMetascore;
    return matchesGenre && matchesScore;
  });

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, nextPage, true);
  };

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-8 pb-32 animate-in fade-in duration-200" id="search-view-container">
      <section className="mb-12 max-w-3xl">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#e5e2e1] mb-6">
          Search Games
        </h1>

        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8e90a0] text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, genre, or developer..."
            className="w-full bg-[#1E1E26] border-0 border-b border-[#444654]/40 text-[#e5e2e1] text-[18px] pl-14 pr-24 py-5 rounded-t-lg transition-colors focus:ring-0 focus:border-[#b8c4ff] outline-none placeholder-[#8e90a0] shadow-md"
            id="search-main-input"
            autoFocus
          />
          <div 
            onClick={onOpenCmdK}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 bg-[#201f1f] hover:bg-[#2a2a2a] rounded border border-[#444654]/30 text-[12px] font-mono-data text-[#8e90a0] cursor-pointer"
          >
            <span>&#8984;</span>
            <span>K</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-[12px] font-mono-data text-[#c4c5d6]">
          <div className="flex items-center gap-3">
            <span>
              {loading ? 'Searching...' : `${filteredGames.length} Result${filteredGames.length !== 1 ? 's' : ''}`}
              {searchQuery ? ` for "${searchQuery}"` : ''}
              {selectedGenre !== 'All Genres' ? ` in ${selectedGenre}` : ''}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#444654]"></span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="hover:text-[#b8c4ff] transition-colors flex items-center gap-1 cursor-pointer font-medium"
              id="toggle-filters-btn"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
              {(selectedGenre !== 'All Genres' || minMetascore > 0) && (
                <span className="w-2 h-2 rounded-full bg-[#b8c4ff] inline-block ml-1"></span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8e90a0]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1b1b] border border-[#444654]/30 text-[#e5e2e1] text-[12px] font-mono-data rounded px-2 py-1 outline-none focus:border-[#b8c4ff]"
              id="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="metascore">Metascore (High to Low)</option>
              <option value="year">Release Year (Newest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-5 bg-[#1c1b1b] border border-[#444654]/30 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-150" id="filter-drawer">
            <div>
              <label className="text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider block mb-2">
                Genre Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRE_LIST.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`text-[12px] font-mono-data px-3 py-1 rounded transition-colors ${
                      selectedGenre === genre
                        ? 'bg-[#b8c4ff] text-[#002585] font-semibold'
                        : 'bg-[#201f1f] text-[#c4c5d6] hover:text-[#e5e2e1] border border-[#444654]/20'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#444654]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-[12px] font-mono-data text-[#c4c5d6]">
                  Minimum Metascore: <span className="text-[#b8c4ff] font-bold">{minMetascore}+</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={minMetascore}
                  onChange={(e) => setMinMetascore(Number(e.target.value))}
                  className="w-32 accent-[#b8c4ff]"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedGenre('All Genres');
                  setMinMetascore(0);
                  setSearchQuery('');
                }}
                className="text-[11px] font-mono-data text-[#8e90a0] hover:text-[#ffb4ab] transition-colors underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {loading && games.length === 0 ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-[#b8c4ff] animate-spin mb-3 block">
            progress_activity
          </span>
          <p className="text-[14px] text-[#8e90a0]">Searching the RAWG database...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#444654]/40 rounded-xl p-8 max-w-xl mx-auto">
          <span className="material-symbols-outlined text-5xl text-[#8e90a0] mb-3 block">
            videogame_asset_off
          </span>
          <h3 className="text-[20px] font-bold text-[#e5e2e1] mb-2">No matching games found</h3>
          <p className="text-[14px] text-[#8e90a0] mb-6">
            We couldn't find any games matching your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All Genres');
              setMinMetascore(0);
            }}
            className="px-5 py-2.5 bg-[#b8c4ff] text-[#002585] rounded text-[13px] font-mono-data font-semibold hover:bg-[#6b89ff] transition-colors"
          >
            Clear Filters & Search
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12" id="search-results-grid">
          {filteredGames.map((game) => (
            <article
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="group cursor-pointer flex flex-col gap-4"
              id={`search-card-${game.id}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded bg-[#201f1f] border border-white/5 shadow-md">
                {game.coverImage ? (
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[64px] text-[#444654]">videogame_asset</span>
                  </div>
                )}
                {game.metascore > 0 && (
                  <div className="absolute top-3 left-3 bg-[#1c1b1b]/90 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[12px] font-mono-data font-medium text-[#b8c4ff] flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>{game.metascore} Metascore</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[20px] font-semibold text-[#e5e2e1] group-hover:text-[#b8c4ff] transition-colors truncate">
                    {game.title}
                  </h2>
                  <span className="text-[12px] font-mono-data text-[#c4c5d6] shrink-0 mt-1">
                    {game.releaseYear || 'TBA'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[13px] font-mono-data text-[#8e90a0]">
                  <span>{game.primaryGenre}</span>
                  <span className="w-1 h-1 rounded-full bg-[#444654]/60"></span>
                  <span>PC</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {filteredGames.length > 0 && games.length < totalCount && (
        <div className="mt-20 flex flex-col items-center justify-center border-t border-[#444654]/20 pt-12">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3.5 border border-[#8e90a0]/40 text-[#e5e2e1] text-[12px] font-mono-data font-semibold rounded hover:bg-[#201f1f] hover:border-[#b8c4ff] transition-colors disabled:opacity-50"
            id="load-more-btn"
          >
            {loading ? 'Loading...' : 'Load More Results'}
          </button>
        </div>
      )}
    </main>
  );
};
