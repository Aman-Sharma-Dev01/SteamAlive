import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types';
import { searchGames } from '../api/rawg';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: string) => void;
  onSearchQuerySubmit: (query: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  onSearchQuerySubmit
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setGames([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setGames([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const { games: results } = await searchGames(query, 8);
        setGames(results);
        setSelectedIndex(0);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, games.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + games.length) % Math.max(1, games.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (games[selectedIndex]) {
          onSelectGame(games[selectedIndex].id);
          onClose();
        } else if (query.trim()) {
          onSearchQuerySubmit(query.trim());
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, games, selectedIndex, query, onClose, onSelectGame, onSearchQuerySubmit]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      id="command-palette-backdrop"
    >
      <div
        className="bg-[#1c1b1b] border border-[#444654]/40 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        id="command-palette-modal"
      >
        <div className="flex items-center px-4 py-4 border-b border-[#444654]/30 bg-[#201f1f]">
          <span className="material-symbols-outlined text-[#8e90a0] mr-3 text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search games by title, genre, or developer..."
            className="w-full bg-transparent text-[#e5e2e1] placeholder-[#8e90a0] outline-none text-[16px]"
            id="command-palette-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8e90a0] hover:text-[#e5e2e1] mr-2"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] font-mono-data text-[#8e90a0] bg-[#131313] px-2 py-1 rounded border border-[#444654]/30">
            <span>ESC</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          <div className="px-4 py-1.5 text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider">
            {loading ? 'Searching...' : query ? `Search Results (${games.length})` : 'Type to search games'}
          </div>

          {!query && !loading && (
            <div className="px-6 py-12 text-center text-[#c4c5d6]">
              <span className="material-symbols-outlined text-4xl text-[#8e90a0] mb-2 block">
                search
              </span>
              <p className="text-[15px] font-medium text-[#e5e2e1]">Start typing to search games</p>
              <p className="text-[13px] text-[#8e90a0] mt-1">Search by title, genre, or developer from the RAWG database.</p>
            </div>
          )}

          {games.length === 0 && query && !loading && (
            <div className="px-6 py-12 text-center text-[#c4c5d6]">
              <span className="material-symbols-outlined text-4xl text-[#8e90a0] mb-2 block">
                search_off
              </span>
              <p className="text-[15px] font-medium text-[#e5e2e1]">No games matched &quot;{query}&quot;</p>
              <p className="text-[13px] text-[#8e90a0] mt-1">Try searching for RPG, Action, Shooter, or other genres.</p>
              <button
                onClick={() => {
                  onSearchQuerySubmit(query);
                  onClose();
                }}
                className="mt-4 px-4 py-2 bg-[#b8c4ff] text-[#002585] rounded text-[12px] font-mono-data font-semibold hover:bg-[#6b89ff]"
              >
                Search full catalog for &quot;{query}&quot;
              </button>
            </div>
          )}

          {games.map((game, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={game.id}
                onClick={() => {
                  onSelectGame(game.id);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#2a2a2a] text-[#e5e2e1]' : 'text-[#c4c5d6] hover:bg-[#201f1f]'
                }`}
                id={`cmd-item-${game.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-12 rounded overflow-hidden bg-[#131313] flex-shrink-0 border border-[#444654]/20">
                    {game.coverImage ? (
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-[#444654]">videogame_asset</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-[#e5e2e1] truncate">
                        {game.title}
                      </span>
                      <span className="text-[11px] font-mono-data text-[#8e90a0]">
                        {game.releaseYear || 'TBA'}
                      </span>
                    </div>
                    <div className="text-[12px] font-mono-data text-[#8e90a0] truncate mt-0.5">
                      {game.primaryGenre}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {game.rating > 0 && (
                    <div className="flex items-center gap-1 bg-[#131313] px-2 py-0.5 rounded border border-[#444654]/30 text-[12px] font-mono-data text-[#b8c4ff]">
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{game.rating}</span>
                    </div>
                  )}
                  {isSelected && (
                    <span className="text-[11px] font-mono-data text-[#b8c4ff] hidden sm:inline">
                      Press &#x21B5;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2.5 bg-[#131313] border-t border-[#444654]/20 flex items-center justify-between text-[11px] font-mono-data text-[#8e90a0]">
          <div className="flex items-center gap-4">
            <span>&uarr;&darr; Navigate</span>
            <span>&#x21B5; Select</span>
            <span>ESC Close</span>
          </div>
          <span>SteamAlive + RAWG</span>
        </div>
      </div>
    </div>
  );
};
