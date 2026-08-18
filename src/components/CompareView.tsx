import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { fetchGameById, fetchGamesByIds } from '../api/rawg';

interface CompareViewProps {
  initialSelectedGameIds?: string[];
  onSelectGame: (gameId: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  initialSelectedGameIds = [],
  onSelectGame
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedGameIds);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      try {
        const games = await fetchGamesByIds(initialSelectedGameIds);
        setAllGames(games);
        setSelectedGames(games);
      } catch (e) {
        console.error('Failed to load compare games', e);
      }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function loadSelected() {
      if (selectedIds.length === 0) { setSelectedGames([]); return; }
      setLoading(true);
      try {
        const games = await fetchGamesByIds(selectedIds);
        setSelectedGames(games);
        setAllGames(prev => {
          const existingIds = new Set(prev.map(g => g.id));
          const newGames = games.filter(g => !existingIds.has(g.id));
          return [...prev, ...newGames];
        });
      } catch (e) {
        console.error('Failed to load compare games', e);
      } finally {
        setLoading(false);
      }
    }
    loadSelected();
  }, [selectedIds]);

  const handleAddGame = (gameId: string) => {
    if (selectedIds.includes(gameId)) return;
    if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, gameId]);
    } else {
      setSelectedIds([selectedIds[0], selectedIds[1], gameId]);
    }
  };

  const handleRemoveGame = (gameId: string) => {
    if (selectedIds.length <= 1) return;
    setSelectedIds(selectedIds.filter((id) => id !== gameId));
  };

  const handleSlotChange = (index: number, newGameId: string) => {
    const next = [...selectedIds];
    next[index] = newGameId;
    setSelectedIds(next);
  };

  const displayGames = selectedGames.length > 0 ? selectedGames : allGames;

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 md:px-16 pt-8 pb-32 animate-in fade-in duration-200" id="compare-main">
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#e5e2e1] mb-2">
          Compare PC Games & Requirements
        </h1>
        <p className="text-[15px] text-[#8e90a0]">
          Compare hardware requirements, metascores, storage footprints, and engine specs side-by-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((slotIdx) => {
          const game = displayGames[slotIdx];
          return (
            <div
              key={slotIdx}
              className="bg-[#1c1b1b] p-4 rounded-lg border border-[#444654]/30 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#2a2a2a] text-[#b8c4ff] text-[12px] font-mono-data flex items-center justify-center font-bold flex-shrink-0">
                  {slotIdx + 1}
                </span>
                <select
                  value={game ? game.id : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSlotChange(slotIdx, e.target.value);
                    }
                  }}
                  className="bg-[#201f1f] text-[#e5e2e1] text-[13px] font-mono-data px-3 py-2 rounded border border-[#444654]/40 outline-none w-full truncate"
                >
                  <option value="">{game ? 'Change game...' : '+ Select game to compare'}</option>
                  {allGames.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.releaseYear || 'TBA'})
                    </option>
                  ))}
                </select>
              </div>

              {game && displayGames.length > 1 && (
                <button
                  onClick={() => handleRemoveGame(game.id)}
                  className="text-[#8e90a0] hover:text-[#ffb4ab] p-1 flex-shrink-0"
                  title="Remove from comparison"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-4xl text-[#b8c4ff] animate-spin mb-3 block">
            progress_activity
          </span>
          <p className="text-[14px] text-[#8e90a0]">Loading game data...</p>
        </div>
      )}

      {displayGames.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] bg-[#1c1b1b] rounded-xl border border-[#444654]/30 overflow-hidden shadow-xl">
            <div className={`grid grid-cols-${displayGames.length + 1} border-b border-[#444654]/30 bg-[#201f1f]`}>
              <div className="p-4 flex items-center text-[12px] font-mono-data text-[#8e90a0] uppercase tracking-wider font-semibold">
                Game
              </div>
              {displayGames.map((game) => (
                <div key={game.id} className="p-4 border-l border-[#444654]/30 flex flex-col items-center text-center">
                  <div
                    onClick={() => onSelectGame(game.id)}
                    className="w-24 h-32 rounded overflow-hidden mb-3 bg-[#131313] border border-[#444654]/30 cursor-pointer hover:scale-105 transition-transform"
                  >
                    {game.coverImage ? (
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[32px] text-[#444654]">videogame_asset</span>
                      </div>
                    )}
                  </div>
                  <h3
                    onClick={() => onSelectGame(game.id)}
                    className="font-bold text-[16px] text-[#e5e2e1] hover:text-[#b8c4ff] cursor-pointer"
                  >
                    {game.title}
                  </h3>
                  <span className="text-[12px] font-mono-data text-[#8e90a0] mt-0.5">
                    {game.primaryGenre}
                  </span>
                </div>
              ))}
            </div>

            {[
              {
                label: 'Metascore',
                render: (g: Game) => (
                  <span className="px-2.5 py-1 rounded bg-[#2a2a2a] text-[#b8c4ff] font-bold font-mono-data text-[13px] border border-[#b8c4ff]/20 inline-block">
                    {g.metascore > 0 ? `\u2605 ${g.metascore} / 100` : 'N/A'}
                  </span>
                )
              },
              {
                label: 'Release Date',
                render: (g: Game) => <span className="text-[#e5e2e1] font-medium">{g.releaseDate || 'TBA'}</span>
              },
              {
                label: 'Developer',
                render: (g: Game) => <span className="text-[#c4c5d6]">{g.developer || 'N/A'}</span>
              },
              {
                label: 'Publisher',
                render: (g: Game) => <span className="text-[#c4c5d6]">{g.publisher || 'N/A'}</span>
              },
              {
                label: 'Storage Footprint',
                render: (g: Game) => (
                  <span className="font-mono-data font-bold text-[#e5e2e1]">{g.storageRequired}</span>
                )
              },
              {
                label: 'Min Memory (RAM)',
                render: (g: Game) => (
                  <span className="font-mono-data text-[#e5e2e1]">{g.systemRequirements.minimum.memory}</span>
                )
              },
              {
                label: 'Min Processor (CPU)',
                render: (g: Game) => (
                  <span className="font-mono-data text-[12px] text-[#c4c5d6]">{g.systemRequirements.minimum.processor}</span>
                )
              },
              {
                label: 'Min Graphics (GPU)',
                render: (g: Game) => (
                  <span className="font-mono-data text-[12px] text-[#c4c5d6]">{g.systemRequirements.minimum.graphics}</span>
                )
              },
              {
                label: 'Rec Memory (RAM)',
                render: (g: Game) => (
                  <span className="font-mono-data font-semibold text-[#b8c4ff]">{g.systemRequirements.recommended.memory}</span>
                )
              },
              {
                label: 'Rec Processor (CPU)',
                render: (g: Game) => (
                  <span className="font-mono-data text-[12px] text-[#c4c5d6]">{g.systemRequirements.recommended.processor}</span>
                )
              },
              {
                label: 'Rec Graphics (GPU)',
                render: (g: Game) => (
                  <span className="font-mono-data text-[12px] text-[#c4c5d6]">{g.systemRequirements.recommended.graphics}</span>
                )
              },
              {
                label: 'DirectX',
                render: (g: Game) => (
                  <span className="font-mono-data text-[#e5e2e1]">{g.systemRequirements.minimum.directx}</span>
                )
              }
            ].map((row, rIdx) => (
              <div
                key={rIdx}
                className={`grid grid-cols-${displayGames.length + 1} border-b border-[#444654]/20 ${
                  rIdx % 2 === 0 ? 'bg-[#1c1b1b]' : 'bg-[#1c1b1b]/60'
                }`}
              >
                <div className="p-3.5 text-[12px] font-mono-data text-[#8e90a0] font-medium flex items-center">
                  {row.label}
                </div>
                {displayGames.map((game) => (
                  <div key={game.id} className="p-3.5 border-l border-[#444654]/20 text-[13px] flex items-center">
                    {row.render(game)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
