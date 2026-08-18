import React from 'react';
import { Screenshot } from '../types';

interface ScreenshotModalProps {
  screenshot: Screenshot | null;
  allScreenshots: Screenshot[];
  onClose: () => void;
  onSelect: (index: number) => void;
  currentIndex: number;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  screenshot,
  allScreenshots,
  onClose,
  onSelect,
  currentIndex
}) => {
  if (!screenshot) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (currentIndex - 1 + allScreenshots.length) % allScreenshots.length;
    onSelect(prev);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (currentIndex + 1) % allScreenshots.length;
    onSelect(next);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      id="screenshot-lightbox"
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-[#e5e2e1] hover:text-[#b8c4ff] flex items-center gap-1 font-mono-data text-[12px] bg-[#1c1b1b]/80 px-3 py-1 rounded border border-[#444654]/40"
          id="close-lightbox-btn"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          <span>ESC</span>
        </button>

        {/* Main Image View */}
        <div className="relative w-full rounded-lg overflow-hidden border border-[#444654]/40 bg-[#0e0e0e] shadow-2xl flex items-center justify-center">
          <img
            src={screenshot.url}
            alt={screenshot.alt}
            referrerPolicy="no-referrer"
            className="w-full max-h-[75vh] object-contain"
          />

          {/* Navigation Arrows */}
          {allScreenshots.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1c1b1b]/80 hover:bg-[#2a2a2a] text-[#e5e2e1] flex items-center justify-center border border-[#444654]/40 transition-colors cursor-pointer"
                id="lightbox-prev-btn"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1c1b1b]/80 hover:bg-[#2a2a2a] text-[#e5e2e1] flex items-center justify-center border border-[#444654]/40 transition-colors cursor-pointer"
                id="lightbox-next-btn"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </>
          )}
        </div>

        {/* Caption & Counter */}
        <div className="w-full mt-3 flex items-center justify-between text-[13px] text-[#c4c5d6] px-2 font-mono-data">
          <span>{screenshot.caption || screenshot.alt}</span>
          <span className="text-[#8e90a0]">
            {currentIndex + 1} / {allScreenshots.length}
          </span>
        </div>
      </div>
    </div>
  );
};
