import React, { useState, useEffect } from 'react';
import { LibraryItem } from '../types';
import { fetchGamesByIds } from '../api/rawg';
import { Game } from '../types';

interface LibraryViewProps {
  libraryItems: LibraryItem[];
  onSelectGame: (gameId: string) => void;
  onUpdateLibrary: (gameId: string, status: LibraryItem['status'] | 'remove', isFavorite?: boolean) => void;
  onNavigateToExplore: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  libraryItems,
  onSelectGame,
  onUpdateLibrary,
  onNavigateToExplore
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLibraryGames() {
      const ids = libraryItems.map(i => i.gameId);
      if (ids.length === 0) { setGames([]); return; }
      setLoading(true);
      try {
        const fetched = await fetchGamesByIds(ids);
        setGames(fetched);
      } catch (e) {
        console.error('Failed to load library games', e);
      } finally {
        setLoading(false);
      }
    }
    loadLibraryGames();
  }, [libraryItems]);

  const libraryWithDetails = libraryItems.map((item) => {
    const game = games.find((g) => g.id === item.gameId);
    return { ...item, game };
  }).filter((item) => item.game !== undefined);

  const filteredItems = libraryWithDetails.filter((item) => {
    if (onlyFavorites && !item.isFavorite) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 md:px-16 pt-8 pb-32 animate-in fade-in duration-200" id="library-main">
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#e5e2e1] mb-2">
            My Game Library
          </h1>
          <p className="text-[15px] text-[#8e90a0]">
            Track your wishlist, actively playing titles, and completed masterworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Games', count: libraryWithDetails.length },
            { id: 'want_to_play', label: 'Want to Play', count: libraryWithDetails.filter((i) => i.status === 'want_to_play').length },
            { id: 'playing', label: 'Playing', count: libraryWithDetails.filter((i) => i.status === 'playing').length },
            { id: 'completed', label: 'Completed', count: libraryWithDetails.filter((i) => i.status === 'completed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded text-[12px] font-mono-data transition-colors flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-[#b8c4ff] text-[#002585] font-semibold'
                  : 'bg-[#1c1b1b] text-[#c4c5d6] hover:text-[#e5e2e1] border border-[#444654]/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === tab.id ? 'bg-[#002585]/20 text-[#002585]' : 'bg-[#2a2a2a] text-[#8e90a0]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded text-[12px] font-mono-data transition-colors flex items-center gap-1 border ${
              onlyFavorites
                ? 'bg-[#93000a]/30 border-[#ffb4ab] text-[#ffb4ab]'
                : 'bg-[#1c1b1b] border-[#444654]/30 text-[#c4c5d6] hover:text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: onlyFavorites ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            <span>Favorites</span>
          </button>
        </div>
      </section>

      {libraryItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#444654]/40 rounded-xl p-8 max-w-xl mx-auto my-8">
          <span className="material-symbols-outlined text-5xl text-[#8e90a0] mb-3 block">
            library_add
          </span>
          <h2 className="text-[20px] font-bold text-[#e5e2e1] mb-2">Your library is currently empty</h2>
          <p className="text-[14px] text-[#8e90a0] mb-6">
            Browse the game catalog and add games to your library to track playtime, status, and system requirements.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="px-6 py-3 bg-[#b8c4ff] text-[#002585] rounded text-[13px] font-mono-data font-semibold hover:bg-[#6b89ff] transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>Explore Games</span>
          </button>
        </div>
      ) : loading ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-[#b8c4ff] animate-spin mb-3 block">
            progress_activity
          </span>
          <p className="text-[14px] text-[#8e90a0]">Loading your library games...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#444654]/40 rounded-xl p-8 max-w-xl mx-auto my-8">
          <span className="material-symbols-outlined text-5xl text-[#8e90a0] mb-3 block">
            filter_list_off
          </span>
          <h2 className="text-[20px] font-bold text-[#e5e2e1] mb-2">No games match this filter</h2>
          <p className="text-[14px] text-[#8e90a0] mb-6">
            Try changing your filter criteria or add more games to your library.
          </p>
          <button
            onClick={() => { setFilterStatus('all'); setOnlyFavorites(false); }}
            className="px-5 py-2.5 bg-[#b8c4ff] text-[#002585] rounded text-[13px] font-mono-data font-semibold hover:bg-[#6b89ff] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(({ game, status, isFavorite }) => {
            if (!game) return null;
            return (
              <div
                key={game.id}
                className="bg-[#1c1b1b] rounded-lg overflow-hidden border border-[#444654]/30 hover:border-[#b8c4ff]/50 transition-all flex flex-col group"
                id={`library-card-${game.id}`}
              >
                <div
                  onClick={() => onSelectGame(game.id)}
                  className="aspect-[16/10] overflow-hidden bg-[#131313] relative cursor-pointer"
                >
                  {game.coverImage ? (
                    <img
                      src={game.bannerImage || game.coverImage}
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] text-[#444654]">videogame_asset</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    {isFavorite && (
                      <span className="bg-[#93000a]/80 backdrop-blur-sm p-1 rounded text-[#ffb4ab] border border-[#ffb4ab]/30">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          favorite
                        </span>
                      </span>
                    )}
                    {game.metascore > 0 && (
                      <span className="bg-[#1c1b1b]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono-data text-[#b8c4ff] border border-white/10">
                        &#9733; {game.metascore}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data uppercase font-bold tracking-wider ${
                      status === 'playing'
                        ? 'bg-[#6b89ff] text-[#001f75]'
                        : status === 'completed'
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-[#2a2a2a] text-[#e5e2e1]'
                    }`}>
                      {status === 'want_to_play' ? 'Want to Play' : status === 'playing' ? 'Playing' : 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div onClick={() => onSelectGame(game.id)} className="cursor-pointer">
                    <h2 className="text-[17px] font-bold text-[#e5e2e1] group-hover:text-[#b8c4ff] transition-colors truncate">
                      {game.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-[12px] font-mono-data text-[#8e90a0]">
                      <span>{game.primaryGenre}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#444654]/20 flex items-center justify-between">
                    <select
                      value={status}
                      onChange={(e) => onUpdateLibrary(game.id, e.target.value as any, isFavorite)}
                      className="bg-[#201f1f] text-[#c4c5d6] text-[11px] font-mono-data px-2 py-1 rounded border border-[#444654]/30 outline-none"
                    >
                      <option value="want_to_play">Want to Play</option>
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => onUpdateLibrary(game.id, 'remove')}
                      className="text-[#8e90a0] hover:text-[#ffb4ab] p-1 transition-colors"
                      title="Remove from library"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};
