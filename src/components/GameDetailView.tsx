import React, { useState, useEffect } from 'react';
import { Game, LibraryItem, UserPcSpecs, Screenshot } from '../types';
import { ScreenshotModal } from './ScreenshotModal';
import { DownloadModal } from './DownloadModal';
import { fetchGameScreenshots, fetchGameTrailers } from '../api/rawg';

interface GameDetailViewProps {
  game: Game;
  onBack: () => void;
  libraryItem?: LibraryItem;
  onUpdateLibrary: (gameId: string, status: LibraryItem['status'] | 'remove', isFavorite?: boolean) => void;
  onCompareGame: (gameId: string) => void;
  userSpecs?: UserPcSpecs;
  onUpdateUserSpecs?: (specs: UserPcSpecs) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  onBack,
  libraryItem,
  onUpdateLibrary,
  onCompareGame,
  userSpecs
}) => {
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(game.screenshots || []);
  const [trailers, setTrailers] = useState<{ name: string; preview: string; videoUrl: string }[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showSpecChecker, setShowSpecChecker] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const isInLibrary = !!libraryItem;

  const passesMinimumRam = userSpecs ? userSpecs.ramGb >= game.minRamGb : null;
  const passesRecommendedRam = userSpecs ? userSpecs.ramGb >= game.recRamGb : null;
  const passesStorage = userSpecs ? userSpecs.freeStorageGb >= game.storageGb : null;

  useEffect(() => {
    async function loadMedia() {
      setLoadingMedia(true);
      try {
        const [shots, movs] = await Promise.allSettled([
          fetchGameScreenshots(game.id),
          fetchGameTrailers(game.id)
        ]);
        if (shots.status === 'fulfilled' && shots.value.length > 0) {
          setScreenshots(shots.value);
        }
        if (movs.status === 'fulfilled') {
          setTrailers(movs.value);
        }
      } catch (e) {
        console.error('Failed to load media', e);
      } finally {
        setLoadingMedia(false);
      }
    }
    loadMedia();
  }, [game.id]);

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 md:px-16 pt-6 pb-32 animate-in fade-in duration-200" id="game-detail-main">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-mono-data text-[#c4c5d6] hover:text-[#b8c4ff] transition-colors py-1 px-2 rounded hover:bg-[#1c1b1b]"
          id="detail-back-btn"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Games</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCompareGame(game.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c1b1b] border border-[#444654]/30 hover:border-[#b8c4ff] text-[12px] font-mono-data text-[#e5e2e1] hover:text-[#b8c4ff] transition-colors cursor-pointer"
            id="detail-compare-btn"
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Compare</span>
          </button>
        </div>
      </div>

      <section className="relative rounded-xl overflow-hidden glass-panel ambient-shadow flex flex-col md:flex-row gap-8 p-6 md:p-12 border border-[#444654]/30" id="detail-hero-section">
        <div className="w-full md:w-1/3 aspect-[3/4] rounded-lg overflow-hidden border border-[#444654]/30 flex-shrink-0 bg-[#1c1b1b] shadow-2xl">
          {game.coverImage ? (
            <img
              src={game.coverImage}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[80px] text-[#444654]">videogame_asset</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 rounded bg-[#2a2a2a] border border-[#444654]/40 text-[12px] font-mono-data font-semibold text-[#b8c4ff] uppercase">
              {game.primaryGenre}
            </span>
            {game.rating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#2a2a2a] border border-[#444654]/40 text-[12px] font-mono-data text-[#c4c5d6]">
                <span className="material-symbols-outlined text-[14px] text-[#b8c4ff]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>{game.rating}/100</span>
              </span>
            )}
            {game.metascore > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#1c1b1b] border border-[#b8c4ff]/30 text-[12px] font-mono-data text-[#b8c4ff]">
                <span>{game.metascore} Metascore</span>
              </span>
            )}
          </div>

          <h1 className="text-[36px] sm:text-[48px] md:text-[54px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[#e5e2e1] mb-3">
            {game.title}
          </h1>

          {game.tagline && (
            <p className="text-[16px] text-[#c4c5d6] font-normal italic mb-6">
              "{game.tagline}"
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 border-t border-[#444654]/30 pt-6">
            <div>
              <div className="text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider mb-1">
                RELEASE DATE
              </div>
              <div className="text-[15px] font-semibold text-[#e5e2e1]">
                {game.releaseDate || 'TBA'}
              </div>
            </div>
            {game.developer && (
              <div>
                <div className="text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider mb-1">
                  DEVELOPER
                </div>
                <div className="text-[15px] font-semibold text-[#e5e2e1]">
                  {game.developer}
                </div>
              </div>
            )}
            {game.publisher && (
              <div>
                <div className="text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider mb-1">
                  PUBLISHER
                </div>
                <div className="text-[15px] font-semibold text-[#e5e2e1]">
                  {game.publisher}
                </div>
              </div>
            )}
            {game.storageRequired !== 'N/A' && (
              <div>
                <div className="text-[11px] font-mono-data text-[#8e90a0] uppercase tracking-wider mb-1">
                  STORAGE REQUIRED
                </div>
                <div className="text-[15px] font-semibold text-[#e5e2e1]">
                  {game.storageRequired}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="bg-[#b8c4ff] text-[#002585] px-8 py-3.5 rounded font-mono-data text-[13px] font-bold hover:bg-[#6b89ff] hover:text-[#001f75] transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer"
              id="download-btn"
            >
              <span>Download Now</span>
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>

            <div className="relative">
              <div className="inline-flex rounded overflow-hidden border border-[#444654]/50">
                <button
                  onClick={() => {
                    if (isInLibrary) {
                      onUpdateLibrary(game.id, 'remove');
                    } else {
                      onUpdateLibrary(game.id, 'want_to_play', false);
                    }
                  }}
                  className={`px-5 py-3 font-mono-data text-[12px] font-semibold flex items-center gap-2 transition-colors ${
                    isInLibrary
                      ? 'bg-[#201f1f] text-[#b8c4ff] hover:bg-[#2a2a2a]'
                      : 'bg-[#1c1b1b] text-[#e5e2e1] hover:bg-[#2a2a2a]'
                  }`}
                  id="add-to-library-btn"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isInLibrary ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>
                    {isInLibrary
                      ? libraryItem.status === 'playing'
                        ? 'Playing'
                        : libraryItem.status === 'completed'
                        ? 'Completed'
                        : 'In Library'
                      : 'Add to Library'}
                  </span>
                </button>

                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-2 py-3 bg-[#1c1b1b] hover:bg-[#2a2a2a] border-l border-[#444654]/40 text-[#c4c5d6]"
                  title="Change Status"
                  id="library-status-dropdown-btn"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                </button>
              </div>

              {showStatusDropdown && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[#1c1b1b] border border-[#444654]/50 rounded shadow-xl py-1 z-30 font-mono-data text-[12px]">
                  <button
                    onClick={() => {
                      onUpdateLibrary(game.id, 'want_to_play');
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-[#e5e2e1] flex items-center justify-between"
                  >
                    <span>Want to Play</span>
                    {libraryItem?.status === 'want_to_play' && (
                      <span className="material-symbols-outlined text-[14px] text-[#b8c4ff]">check</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateLibrary(game.id, 'playing');
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-[#e5e2e1] flex items-center justify-between"
                  >
                    <span>Currently Playing</span>
                    {libraryItem?.status === 'playing' && (
                      <span className="material-symbols-outlined text-[14px] text-[#b8c4ff]">check</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateLibrary(game.id, 'completed');
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-[#e5e2e1] flex items-center justify-between"
                  >
                    <span>Completed</span>
                    {libraryItem?.status === 'completed' && (
                      <span className="material-symbols-outlined text-[14px] text-[#b8c4ff]">check</span>
                    )}
                  </button>
                  {isInLibrary && (
                    <button
                      onClick={() => {
                        onUpdateLibrary(game.id, 'remove');
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-[#ffb4ab] border-t border-[#444654]/20 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>Remove from Library</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (libraryItem) {
                  onUpdateLibrary(game.id, libraryItem.status, !libraryItem.isFavorite);
                } else {
                  onUpdateLibrary(game.id, 'want_to_play', true);
                }
              }}
              className={`p-3 rounded border border-[#444654]/40 hover:border-[#b8c4ff] transition-colors ${
                libraryItem?.isFavorite ? 'text-[#ffb4ab] bg-[#93000a]/20' : 'text-[#c4c5d6] bg-[#1c1b1b]'
              }`}
              title={libraryItem?.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
              id="favorite-btn"
            >
              <span 
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: libraryItem?.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
      </section>

      {game.description && (
        <section className="mt-20 max-w-3xl" id="detail-about-section">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#e5e2e1] mb-6 border-b border-[#444654]/30 pb-4 inline-block">
            About
          </h2>
          <div className="text-[17px] text-[#c4c5d6] space-y-6 leading-relaxed">
            {game.aboutParagraphs?.length ? (
              game.aboutParagraphs.map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p>{game.description}</p>
            )}
          </div>
        </section>
      )}

      {screenshots.length > 0 && (
        <section className="mt-20" id="detail-gallery-section">
          <div className="flex items-center justify-between mb-8 border-b border-[#444654]/30 pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold text-[#e5e2e1]">
              Gallery
            </h2>
            <span className="text-[12px] font-mono-data text-[#8e90a0]">
              Click any image to expand
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {screenshots.map((s, idx) => {
              const colSpan = idx === 0 ? 'md:col-span-8' : idx === 1 ? 'md:col-span-4' : 'md:col-span-12';
              const heightClass = idx === 2 ? 'h-[420px] md:h-[500px]' : 'h-[320px] md:h-[400px]';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedScreenshotIndex(idx)}
                  className={`${colSpan} rounded-lg overflow-hidden border border-[#444654]/30 ambient-shadow glass-panel cursor-pointer group relative`}
                  id={`gallery-shot-${idx}`}
                >
                  <img
                    src={s.url}
                    alt={s.alt}
                    referrerPolicy="no-referrer"
                    className={`w-full ${heightClass} object-cover group-hover:scale-105 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[13px] font-mono-data text-[#e5e2e1] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      <span>{s.caption || 'Enlarge Screenshot'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {trailers.length > 0 && (
        <section className="mt-20" id="detail-trailers-section">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#e5e2e1] mb-8 border-b border-[#444654]/30 pb-4">
            Trailers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trailers.map((trailer, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-[#444654]/30 bg-[#1c1b1b]">
                <video
                  controls
                  poster={trailer.preview}
                  className="w-full aspect-video object-cover"
                >
                  <source src={trailer.videoUrl} type="video/mp4" />
                </video>
                <div className="px-4 py-3">
                  <span className="text-[13px] font-mono-data text-[#c4c5d6]">{trailer.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {game.systemRequirements && (
        <section className="mt-20" id="detail-requirements-section">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[#444654]/30 pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold text-[#e5e2e1]">
              System Requirements
            </h2>

            {userSpecs && game.minRamGb > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono-data text-[#8e90a0]">Your PC:</span>
                <span className={`px-2.5 py-1 rounded text-[11px] font-mono-data font-semibold ${
                  passesRecommendedRam ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : passesMinimumRam ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                }`}>
                  {passesRecommendedRam ? 'Meets Recommended' : passesMinimumRam ? 'Meets Minimum' : 'Below Minimum'}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="glass-panel p-6 md:p-8 rounded-xl border border-[#444654]/30 shadow-lg">
              <h3 className="text-[20px] font-semibold text-[#e5e2e1] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8e90a0]">memory</span>
                <span>Minimum</span>
              </h3>
              <ul className="space-y-4 font-mono-data text-[13px]">
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">OS</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.os}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">PROCESSOR</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.processor}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">MEMORY</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.memory}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">GRAPHICS</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.graphics}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">DIRECTX</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.directx}</span>
                </li>
                {game.systemRequirements.minimum.storage && game.systemRequirements.minimum.storage !== 'N/A' && (
                  <li className="flex flex-col md:flex-row md:justify-between py-3">
                    <span className="text-[#8e90a0] mb-1 md:mb-0">STORAGE</span>
                    <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.minimum.storage}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-xl border border-[#444654]/30 bg-[#1c1b1b]/50 shadow-lg">
              <h3 className="text-[20px] font-semibold text-[#e5e2e1] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b8c4ff]">speed</span>
                <span>Recommended</span>
              </h3>
              <ul className="space-y-4 font-mono-data text-[13px]">
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">OS</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.os}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">PROCESSOR</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.processor}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">MEMORY</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.memory}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">GRAPHICS</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.graphics}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between py-3 border-b border-[#353534]/50">
                  <span className="text-[#8e90a0] mb-1 md:mb-0">DIRECTX</span>
                  <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.directx}</span>
                </li>
                {game.systemRequirements.recommended.storage && game.systemRequirements.recommended.storage !== 'N/A' && (
                  <li className="flex flex-col md:flex-row md:justify-between py-3">
                    <span className="text-[#8e90a0] mb-1 md:mb-0">STORAGE</span>
                    <span className="text-[#e5e2e1] font-medium text-right">{game.systemRequirements.recommended.storage}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      )}

      {selectedScreenshotIndex !== null && screenshots.length > 0 && (
        <ScreenshotModal
          screenshot={screenshots[selectedScreenshotIndex]}
          allScreenshots={screenshots}
          currentIndex={selectedScreenshotIndex}
          onSelect={(idx) => setSelectedScreenshotIndex(idx)}
          onClose={() => setSelectedScreenshotIndex(null)}
        />
      )}

      {showDownloadModal && (
        <DownloadModal
          gameTitle={game.title}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </main>
  );
};
