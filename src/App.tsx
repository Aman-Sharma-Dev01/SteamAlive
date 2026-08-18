/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Game, NavTab, LibraryItem, UserPcSpecs } from './types';
import { fetchTrendingGames, fetchGameById, fetchGamesByIds } from './api/rawg';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { SearchView } from './components/SearchView';
import { GameDetailView } from './components/GameDetailView';
import { LibraryView } from './components/LibraryView';
import { CompareView } from './components/CompareView';
import { ProfileView } from './components/ProfileView';
import { CommandPalette } from './components/CommandPalette';

const DEFAULT_SPECS: UserPcSpecs = {
  os: 'Windows 11 64-bit',
  cpu: 'Intel Core i7-13700K / AMD Ryzen 7 7800X3D',
  ramGb: 16,
  gpu: 'NVIDIA GeForce RTX 3070 8GB',
  vramGb: 8,
  directx: 12,
  freeStorageGb: 450
};

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<NavTab>('explore');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [searchInitialGenre, setSearchInitialGenre] = useState('');
  const [compareGameIds, setCompareGameIds] = useState<string[]>([]);

  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('steamalive_library');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userSpecs, setUserSpecs] = useState<UserPcSpecs>(() => {
    try {
      const saved = localStorage.getItem('steamalive_user_specs');
      return saved ? JSON.parse(saved) : DEFAULT_SPECS;
    } catch {
      return DEFAULT_SPECS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('steamalive_library', JSON.stringify(library));
    } catch (e) {
      console.error('Failed to save library', e);
    }
  }, [library]);

  useEffect(() => {
    try {
      localStorage.setItem('steamalive_user_specs', JSON.stringify(userSpecs));
    } catch (e) {
      console.error('Failed to save user specs', e);
    }
  }, [userSpecs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadInitialGames() {
      try {
        setLoading(true);
        const fetched = await fetchTrendingGames(20);
        setGames(fetched);
        if (fetched.length >= 2) {
          setCompareGameIds([fetched[0].id, fetched[1].id]);
        }
      } catch (e) {
        setError('Failed to load games from RAWG API.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialGames();
  }, []);

  const handleSelectGame = useCallback(async (gameId: string) => {
    const cached = games.find(g => g.id === gameId);
    if (cached && cached.description) {
      setSelectedGame(cached);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      const detail = await fetchGameById(gameId);
      if (detail) {
        setSelectedGame(detail);
        setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...detail } : g));
      }
    } catch (e) {
      console.error('Failed to fetch game detail', e);
      if (cached) setSelectedGame(cached);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [games]);

  const handleBackFromDetail = () => {
    setSelectedGame(null);
  };

  const handleNavigateToSearch = (initialQuery = '', genre = '') => {
    setSelectedGame(null);
    setSearchInitialQuery(initialQuery);
    setSearchInitialGenre(genre);
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateLibrary = (
    gameId: string,
    status: LibraryItem['status'] | 'remove',
    isFavorite?: boolean
  ) => {
    setLibrary((prev) => {
      if (status === 'remove') {
        return prev.filter((item) => item.gameId !== gameId);
      }
      const existingIndex = prev.findIndex((item) => item.gameId === gameId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          isFavorite: isFavorite !== undefined ? isFavorite : updated[existingIndex].isFavorite
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            gameId,
            status,
            isFavorite: isFavorite || false,
            addedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
    });
  };

  const handleCompareGame = (gameId: string) => {
    setCompareGameIds((prev) => {
      if (prev.includes(gameId)) return prev;
      return [gameId, ...prev.slice(0, 2)];
    });
    setSelectedGame(null);
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col items-center justify-center font-body-md">
        <span className="material-symbols-outlined text-[48px] text-[#b8c4ff] animate-spin mb-4">
          progress_activity
        </span>
        <p className="text-[16px] text-[#8e90a0]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col items-center justify-center font-body-md">
        <span className="material-symbols-outlined text-[48px] text-[#ffb4ab] mb-4">error</span>
        <p className="text-[16px] text-[#ffb4ab]">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#b8c4ff] text-[#002585] rounded font-mono-data text-[13px] font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-body-md selection:bg-[#6b89ff] selection:text-[#001f75]">
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedGame(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearchModal={() => setIsCmdKOpen(true)}
        selectedGameId={selectedGame?.id || null}
        onGoHome={() => {
          setSelectedGame(null);
          setCurrentTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        libraryCount={library.length}
      />

      <div className="flex-grow flex flex-col">
        {selectedGame ? (
          <GameDetailView
            game={selectedGame}
            onBack={handleBackFromDetail}
            libraryItem={library.find((item) => item.gameId === selectedGame.id)}
            onUpdateLibrary={handleUpdateLibrary}
            onCompareGame={handleCompareGame}
            userSpecs={userSpecs}
            onUpdateUserSpecs={setUserSpecs}
          />
        ) : currentTab === 'explore' ? (
          <ExploreView
            games={games}
            onSelectGame={handleSelectGame}
            onNavigateToSearch={handleNavigateToSearch}
            onOpenCmdK={() => setIsCmdKOpen(true)}
          />
        ) : currentTab === 'search' ? (
          <SearchView
            initialQuery={searchInitialQuery}
            initialGenre={searchInitialGenre}
            onSelectGame={handleSelectGame}
            onOpenCmdK={() => setIsCmdKOpen(true)}
          />
        ) : currentTab === 'library' ? (
          <LibraryView
            libraryItems={library}
            onSelectGame={handleSelectGame}
            onUpdateLibrary={handleUpdateLibrary}
            onNavigateToExplore={() => {
              setCurrentTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentTab === 'compare' ? (
          <CompareView
            initialSelectedGameIds={compareGameIds}
            onSelectGame={handleSelectGame}
          />
        ) : currentTab === 'profile' ? (
          <ProfileView
            userSpecs={userSpecs}
            onUpdateSpecs={setUserSpecs}
            libraryItems={library}
            onSelectGame={handleSelectGame}
          />
        ) : null}
      </div>

      {!selectedGame && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setSelectedGame(null);
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          libraryCount={library.length}
        />
      )}

      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        onSelectGame={handleSelectGame}
        onSearchQuerySubmit={(query) => handleNavigateToSearch(query)}
      />
    </div>
  );
}
