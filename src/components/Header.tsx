import React from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearchModal: () => void;
  selectedGameId: string | null;
  onGoHome: () => void;
  libraryCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearchModal,
  onGoHome,
  libraryCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#131313]/95 backdrop-blur-md border-b border-[#444654]/20 transition-all duration-150">
      <div className="flex justify-between items-center w-full px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
        {/* Logo & Brand */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 hover:opacity-85 transition-opacity duration-200 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded bg-[#b8c4ff]/10 flex items-center justify-center border border-[#b8c4ff]/20 text-[#b8c4ff] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px] text-[#b8c4ff]" style={{ fontVariationSettings: "'FILL' 1" }}>
              database
            </span>
          </div>
          <span className="text-[20px] font-extrabold tracking-tight text-[#e5e2e1]">
            SteamAlive
          </span>
        </div>

        {/* Desktop Navigation Cluster */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          <button
            onClick={() => onSelectTab('library')}
            className={`text-[12px] font-medium font-mono-data tracking-wider uppercase flex items-center gap-2 transition-colors duration-200 py-1 ${
              currentTab === 'library'
                ? 'text-[#b8c4ff] border-b-2 border-[#b8c4ff]'
                : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
            }`}
            id="nav-tab-library"
          >
            <span>Library</span>
            {libraryCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#353534] text-[10px] rounded text-[#b8c4ff]">
                {libraryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('explore')}
            className={`text-[12px] font-medium font-mono-data tracking-wider uppercase transition-colors duration-200 py-1 ${
              currentTab === 'explore'
                ? 'text-[#b8c4ff] border-b-2 border-[#b8c4ff]'
                : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
            }`}
            id="nav-tab-explore"
          >
            Explore
          </button>

          <button
            onClick={() => onSelectTab('search')}
            className={`text-[12px] font-medium font-mono-data tracking-wider uppercase transition-colors duration-200 py-1 ${
              currentTab === 'search'
                ? 'text-[#b8c4ff] border-b-2 border-[#b8c4ff]'
                : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
            }`}
            id="nav-tab-search"
          >
            Search
          </button>

          <button
            onClick={() => onSelectTab('compare')}
            className={`text-[12px] font-medium font-mono-data tracking-wider uppercase transition-colors duration-200 py-1 ${
              currentTab === 'compare'
                ? 'text-[#b8c4ff] border-b-2 border-[#b8c4ff]'
                : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
            }`}
            id="nav-tab-compare"
          >
            Compare
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`text-[12px] font-medium font-mono-data tracking-wider uppercase transition-colors duration-200 py-1 ${
              currentTab === 'profile'
                ? 'text-[#b8c4ff] border-b-2 border-[#b8c4ff]'
                : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
            }`}
            id="nav-tab-profile"
          >
            Profile
          </button>
        </nav>

        {/* Right Search Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearchModal}
            aria-label="Search Database"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1c1b1b] border border-[#444654]/30 hover:border-[#b8c4ff]/50 text-[#c4c5d6] hover:text-[#e5e2e1] transition-colors cursor-pointer group"
            id="header-search-btn"
          >
            <span className="material-symbols-outlined text-[18px] text-[#b8c4ff] group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="hidden sm:inline text-[12px] font-mono-data text-[#8e90a0]">
              Search <span className="text-[10px] bg-[#2a2a2a] px-1 py-0.5 rounded border border-[#444654]/40 ml-1">CMD+K</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
