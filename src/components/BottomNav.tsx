import React from 'react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  libraryCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  libraryCount = 0
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-safe py-2 bg-[#131313]/95 backdrop-blur-md md:hidden border-t border-[#444654]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
      id="mobile-bottom-nav"
    >
      {/* Library Tab */}
      <button
        onClick={() => onSelectTab('library')}
        className={`flex flex-col items-center justify-center transition-colors cursor-pointer w-16 h-14 relative ${
          currentTab === 'library' ? 'text-[#b8c4ff]' : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
        }`}
        id="mobile-nav-library"
      >
        <div className="relative">
          <span 
            className="material-symbols-outlined text-[22px] mb-0.5"
            style={{ fontVariationSettings: currentTab === 'library' ? "'FILL' 1" : "'FILL' 0" }}
          >
            grid_view
          </span>
          {libraryCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#6b89ff] text-[#001453] text-[9px] font-bold rounded-full flex items-center justify-center">
              {libraryCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium font-mono-data tracking-wide">Library</span>
      </button>

      {/* Explore Tab (Pill Active Style as in screenshot) */}
      {currentTab === 'explore' ? (
        <button
          onClick={() => onSelectTab('explore')}
          className="flex flex-col items-center justify-center bg-[#6b89ff] text-[#001f75] rounded-full px-5 py-1 cursor-pointer scale-95 transition-transform w-18 h-12 shadow-sm font-semibold"
          id="mobile-nav-explore-active"
        >
          <span className="material-symbols-outlined text-[20px] mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore
          </span>
          <span className="text-[10px] font-mono-data font-bold tracking-tight">Explore</span>
        </button>
      ) : (
        <button
          onClick={() => onSelectTab('explore')}
          className="flex flex-col items-center justify-center text-[#c4c5d6] hover:text-[#b8c4ff] transition-colors cursor-pointer w-16 h-14"
          id="mobile-nav-explore"
        >
          <span className="material-symbols-outlined text-[22px] mb-0.5">
            explore
          </span>
          <span className="text-[10px] font-medium font-mono-data tracking-wide">Explore</span>
        </button>
      )}

      {/* Compare Tab */}
      <button
        onClick={() => onSelectTab('compare')}
        className={`flex flex-col items-center justify-center transition-colors cursor-pointer w-16 h-14 ${
          currentTab === 'compare' ? 'text-[#b8c4ff]' : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
        }`}
        id="mobile-nav-compare"
      >
        <span 
          className="material-symbols-outlined text-[22px] mb-0.5"
          style={{ fontVariationSettings: currentTab === 'compare' ? "'FILL' 1" : "'FILL' 0" }}
        >
          compare_arrows
        </span>
        <span className="text-[10px] font-medium font-mono-data tracking-wide">Compare</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center transition-colors cursor-pointer w-16 h-14 ${
          currentTab === 'profile' ? 'text-[#b8c4ff]' : 'text-[#c4c5d6] hover:text-[#b8c4ff]'
        }`}
        id="mobile-nav-profile"
      >
        <span 
          className="material-symbols-outlined text-[22px] mb-0.5"
          style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
        >
          person
        </span>
        <span className="text-[10px] font-medium font-mono-data tracking-wide">Profile</span>
      </button>
    </nav>
  );
};
