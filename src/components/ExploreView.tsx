import React, { useState } from 'react';
import { Game } from '../types';

interface ExploreViewProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onNavigateToSearch: (initialQuery?: string, genre?: string) => void;
  onOpenCmdK: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  games,
  onSelectGame,
  onNavigateToSearch,
  onOpenCmdK
}) => {
  const [searchInput, setSearchInput] = useState('');

  const topGames = games.slice(0, 6);
  const restGames = games.slice(6, 14);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigateToSearch(searchInput.trim());
    } else {
      onNavigateToSearch('');
    }
  };

  return (
    <div className="w-full pb-28 md:pb-16 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-16 pt-16 md:pt-24 pb-16 md:pb-20 flex flex-col items-center text-center">
        <h1 className="text-[38px] sm:text-[48px] md:text-[56px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[#e5e2e1] mb-6 max-w-3xl">
          Find Your Next Game
        </h1>
        <p className="text-[16px] sm:text-[18px] text-[#c4c5d6] max-w-2xl mb-10 leading-relaxed font-normal">
          Explore games, screenshots, ratings and PC requirements from the RAWG database.
        </p>

        <form 
          onSubmit={handleSearchSubmit} 
          className="w-full max-w-2xl relative group"
          id="hero-search-form"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#8e90a0] group-focus-within:text-[#b8c4ff] transition-colors text-[20px]">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a game..."
            className="w-full bg-[#1c1b1b] border-b border-[#1c1b1b] focus:border-[#b8c4ff] text-[#e5e2e1] text-[16px] py-4 pl-12 pr-24 rounded-lg focus:rounded-b-none outline-none transition-all duration-300 placeholder-[#8e90a0] shadow-md group-hover:border-[#444654]/60"
            id="hero-search-input"
          />
          <div 
            onClick={onOpenCmdK}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
          >
            <span className="text-[11px] font-mono-data text-[#8e90a0] bg-[#201f1f] hover:bg-[#2a2a2a] hover:text-[#e5e2e1] px-2 py-1 rounded border border-[#444654]/30 transition-colors">
              CMD+K
            </span>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl">
          <span className="text-[12px] font-mono-data text-[#8e90a0] mr-1">Popular:</span>
          {['Action', 'RPG', 'Shooter', 'Adventure', 'Indie', 'Strategy', 'Fighting'].map((genre) => (
            <button
              key={genre}
              onClick={() => onNavigateToSearch('', genre)}
              className="text-[11px] font-mono-data px-2.5 py-1 rounded bg-[#1c1b1b] border border-[#444654]/20 text-[#c4c5d6] hover:text-[#b8c4ff] hover:border-[#b8c4ff]/40 transition-colors"
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Games Section */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-10" id="trending-section">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-[24px] md:text-[32px] font-bold tracking-tight text-[#e5e2e1]">
            Top Rated
          </h2>
          <button
            onClick={() => onNavigateToSearch('')}
            className="text-[12px] font-mono-data tracking-wider uppercase text-[#b8c4ff] hover:text-[#dde1ff] transition-colors flex items-center gap-1 group"
            id="view-all-trending-btn"
          >
            <span>VIEW ALL</span>
            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {topGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="group cursor-pointer flex flex-col gap-3"
              id={`trending-card-${game.id}`}
            >
              <div className="aspect-[3/4] rounded overflow-hidden bg-[#1c1b1b] relative border border-[#444654]/20 shadow-md">
                {game.coverImage ? (
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-[#444654]">videogame_asset</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-[#201f1f]/85 backdrop-blur-md px-2 py-1 rounded border border-[#444654]/40 flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[13px] text-[#b8c4ff]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[12px] font-mono-data font-semibold text-[#e5e2e1]">
                    {game.rating}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-[#e5e2e1] group-hover:text-[#b8c4ff] transition-colors truncate">
                  {game.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] font-mono-data text-[#8e90a0]">
                    {game.releaseYear || 'TBA'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#444654]"></span>
                  <span className="text-[12px] font-mono-data text-[#8e90a0] truncate">
                    {game.primaryGenre}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Games Section */}
      {restGames.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-12" id="popular-section">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[24px] md:text-[32px] font-bold tracking-tight text-[#e5e2e1]">
              More Games
            </h2>
            <button
              onClick={() => onNavigateToSearch('')}
              className="text-[12px] font-mono-data tracking-wider uppercase text-[#b8c4ff] hover:text-[#dde1ff] transition-colors flex items-center gap-1 group"
              id="explore-more-popular-btn"
            >
              <span>EXPLORE MORE</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className="group cursor-pointer bg-[#1c1b1b] rounded-lg p-4 flex gap-4 items-center border border-[#444654]/20 hover:bg-[#201f1f] hover:border-[#b8c4ff]/30 transition-all shadow-sm"
                id={`popular-bento-${game.id}`}
              >
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-[#2a2a2a] border border-[#444654]/20">
                  {game.coverImage ? (
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px] text-[#444654]">videogame_asset</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-[15px] font-semibold text-[#e5e2e1] group-hover:text-[#b8c4ff] transition-colors truncate">
                    {game.title}
                  </h3>
                  <span className="text-[12px] font-mono-data text-[#8e90a0] mt-1">
                    {game.primaryGenre}
                  </span>
                  {game.metascore > 0 && (
                    <span className="text-[11px] font-mono-data text-[#b8c4ff] mt-0.5">
                      &#9733; {game.metascore} Metascore
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
