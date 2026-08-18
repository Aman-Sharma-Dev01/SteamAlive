import React, { useEffect } from 'react';

interface DownloadModalProps {
  gameTitle: string;
  onClose: () => void;
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SOURCES = [
  {
    id: 'steamrip',
    label: 'SteamRip',
    tagline: 'Pre-installed repacks',
    color: '#b8c4ff',
    url: (slug: string) => `https://steamrip.com/${slug}`
  },
  {
    id: 'fitgirl',
    label: 'FitGirl',
    tagline: 'Highly compressed repacks',
    color: '#b5e48c',
    url: (slug: string) => `https://fitgirl-repacks.site/${slug}/`
  },
  {
    id: 'dodi',
    label: 'DODI Repacks',
    tagline: 'Compressed installer repacks',
    color: '#ffd6a5',
    url: (slug: string) => `https://dodi-repacks.site/${slug}/`
  }
];

export const DownloadModal: React.FC<DownloadModalProps> = ({ gameTitle, onClose }) => {
  const slug = slugify(gameTitle);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      id="download-modal"
    >
      <div
        className="relative w-full max-w-md rounded-xl glass-panel ambient-shadow border border-[#444654]/30 bg-[#1c1b1b] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#e5e2e1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#b8c4ff]">download</span>
              Download Now
            </h2>
            <p className="text-[13px] text-[#8e90a0] font-mono-data mt-1 break-words">
              {gameTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#c4c5d6] hover:text-[#e5e2e1] p-1 rounded hover:bg-[#2a2a2a] transition-colors"
            aria-label="Close download options"
            id="close-download-modal-btn"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {SOURCES.map((source) => (
            <a
              key={source.id}
              href={source.url(slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-[#2a2a2a] border border-[#444654]/40 hover:border-[#b8c4ff] hover:bg-[#333] transition-all duration-200 group"
              id={`download-source-${source.id}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold font-mono-data text-[#131313]"
                  style={{ backgroundColor: source.color }}
                >
                  {source.label[0]}
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-[#e5e2e1] group-hover:text-[#b8c4ff] transition-colors">
                    {source.label}
                  </div>
                  <div className="text-[11px] text-[#8e90a0] font-mono-data">{source.tagline}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#8e90a0] group-hover:text-[#b8c4ff] transition-colors">
                open_in_new
              </span>
            </a>
          ))}
        </div>

        <p className="mt-5 text-[11px] text-[#8e90a0] font-mono-data text-center">
          Links open in a new tab
        </p>
      </div>
    </div>
  );
};
