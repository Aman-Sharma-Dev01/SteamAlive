import React, { useState } from 'react';
import { UserPcSpecs, LibraryItem } from '../types';

interface ProfileViewProps {
  userSpecs: UserPcSpecs;
  onUpdateSpecs: (specs: UserPcSpecs) => void;
  libraryItems: LibraryItem[];
  onSelectGame: (gameId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userSpecs,
  onUpdateSpecs,
  libraryItems,
  onSelectGame
}) => {
  const [specs, setSpecs] = useState<UserPcSpecs>(userSpecs);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSpecs(specs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 md:px-16 pt-8 pb-32 animate-in fade-in duration-200" id="profile-main">
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#e5e2e1] mb-2">
          PC Hardware Profile & Settings
        </h1>
        <p className="text-[15px] text-[#8e90a0]">
          Configure your PC specifications to automatically test compatibility against games in SteamAlive.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#1c1b1b] p-6 md:p-8 rounded-xl border border-[#444654]/30 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#444654]/30">
            <h2 className="text-[20px] font-bold text-[#e5e2e1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b8c4ff]">computer</span>
              <span>My PC Hardware Rig</span>
            </h2>
            {isSaved && (
              <span className="text-[12px] font-mono-data text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Specs Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[12px] font-mono-data text-[#8e90a0] uppercase block mb-1.5">
                Operating System (OS)
              </label>
              <input
                type="text"
                value={specs.os}
                onChange={(e) => setSpecs({ ...specs, os: e.target.value })}
                className="w-full bg-[#201f1f] text-[#e5e2e1] text-[14px] font-mono-data px-4 py-3 rounded border border-[#444654]/40 focus:border-[#b8c4ff] outline-none"
                placeholder="e.g. Windows 11 64-Bit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-mono-data text-[#8e90a0] uppercase block mb-1.5">
                  Processor (CPU)
                </label>
                <input
                  type="text"
                  value={specs.cpu}
                  onChange={(e) => setSpecs({ ...specs, cpu: e.target.value })}
                  className="w-full bg-[#201f1f] text-[#e5e2e1] text-[14px] font-mono-data px-4 py-3 rounded border border-[#444654]/40 focus:border-[#b8c4ff] outline-none"
                  placeholder="e.g. AMD Ryzen 7 7800X3D"
                />
              </div>

              <div>
                <label className="text-[12px] font-mono-data text-[#8e90a0] uppercase block mb-1.5">
                  System Memory (RAM in GB)
                </label>
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={specs.ramGb}
                  onChange={(e) => setSpecs({ ...specs, ramGb: Number(e.target.value) })}
                  className="w-full bg-[#201f1f] text-[#e5e2e1] text-[14px] font-mono-data px-4 py-3 rounded border border-[#444654]/40 focus:border-[#b8c4ff] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-mono-data text-[#8e90a0] uppercase block mb-1.5">
                  Graphics Card (GPU)
                </label>
                <input
                  type="text"
                  value={specs.gpu}
                  onChange={(e) => setSpecs({ ...specs, gpu: e.target.value })}
                  className="w-full bg-[#201f1f] text-[#e5e2e1] text-[14px] font-mono-data px-4 py-3 rounded border border-[#444654]/40 focus:border-[#b8c4ff] outline-none"
                  placeholder="e.g. NVIDIA RTX 4070 12GB"
                />
              </div>

              <div>
                <label className="text-[12px] font-mono-data text-[#8e90a0] uppercase block mb-1.5">
                  Free Storage Space (GB)
                </label>
                <input
                  type="number"
                  min="10"
                  max="4000"
                  value={specs.freeStorageGb}
                  onChange={(e) => setSpecs({ ...specs, freeStorageGb: Number(e.target.value) })}
                  className="w-full bg-[#201f1f] text-[#e5e2e1] text-[14px] font-mono-data px-4 py-3 rounded border border-[#444654]/40 focus:border-[#b8c4ff] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#444654]/20 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 bg-[#b8c4ff] text-[#002585] rounded font-mono-data text-[13px] font-bold hover:bg-[#6b89ff] transition-colors"
                id="save-specs-btn"
              >
                Save Hardware Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  const defaultRig = {
                    os: 'Windows 11 64-bit',
                    cpu: 'Intel Core i7-13700K / Ryzen 7 7800X3D',
                    ramGb: 32,
                    gpu: 'NVIDIA GeForce RTX 4070',
                    vramGb: 12,
                    directx: 12,
                    freeStorageGb: 500
                  };
                  setSpecs(defaultRig);
                  onUpdateSpecs(defaultRig);
                }}
                className="text-[12px] font-mono-data text-[#8e90a0] hover:text-[#e5e2e1]"
              >
                Reset to Gaming Rig Default
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1c1b1b] p-6 rounded-xl border border-[#444654]/30 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#e5e2e1] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">task_alt</span>
              <span>Collection Summary</span>
            </h3>

            <div className="space-y-4 font-mono-data text-[13px]">
              <div className="p-3 bg-[#201f1f] rounded border border-[#444654]/30 flex items-center justify-between">
                <span className="text-[#c4c5d6]">Library Items Tracked:</span>
                <span className="text-[#e5e2e1] font-bold text-[14px]">
                  {libraryItems.length} Games
                </span>
              </div>

              <div className="p-3 bg-[#201f1f] rounded border border-[#444654]/30 flex items-center justify-between">
                <span className="text-[#c4c5d6]">Playing:</span>
                <span className="text-[#b8c4ff] font-bold text-[14px]">
                  {libraryItems.filter(i => i.status === 'playing').length}
                </span>
              </div>

              <div className="p-3 bg-[#201f1f] rounded border border-[#444654]/30 flex items-center justify-between">
                <span className="text-[#c4c5d6]">Completed:</span>
                <span className="text-emerald-400 font-bold text-[14px]">
                  {libraryItems.filter(i => i.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1b1b] p-6 rounded-xl border border-[#444654]/30 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#e5e2e1] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b8c4ff]">database</span>
              <span>About SteamAlive</span>
            </h3>
            <p className="text-[13px] text-[#8e90a0] leading-relaxed">
              SteamAlive is a PC gaming database powered by the RAWG API, featuring high-fidelity cover art, detailed system specifications, Metascores, and hardware comparison tools.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
