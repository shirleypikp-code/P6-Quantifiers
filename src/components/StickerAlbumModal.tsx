import React from 'react';
import { STICKERS_COLLECTION } from '../data/quantifierData';
import { Sticker } from '../types/game';
import { sounds } from '../utils/audio';
import { Award, X, Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface StickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedStickerIds: string[];
  newlyUnlockedSticker?: Sticker | null;
  onClearNewSticker?: () => void;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  onClose,
  unlockedStickerIds,
  newlyUnlockedSticker,
  onClearNewSticker
}) => {
  if (!isOpen && !newlyUnlockedSticker) return null;

  const handleClose = () => {
    sounds.playClick();
    if (onClearNewSticker) onClearNewSticker();
    onClose();
  };

  // If there's a freshly awarded sticker, celebrate it first
  if (newlyUnlockedSticker) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl relative animate-scaleUp">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chapter Reward Earned!</span>
          </div>

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-2xl my-3 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-5xl">
              {newlyUnlockedSticker.icon}
            </div>
          </div>

          <h2 className="text-2xl font-extrabold font-['Cinzel',serif] text-amber-300 mt-2">
            {newlyUnlockedSticker.title}
          </h2>
          <div className="text-xs font-mono text-slate-400 font-semibold mb-3">
            {newlyUnlockedSticker.subtitle}
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6">
            {newlyUnlockedSticker.description}
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              if (onClearNewSticker) onClearNewSticker();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95"
          >
            Claim Sticker & View Album
          </button>
        </div>
      </div>
    );
  }

  const unlockedCount = unlockedStickerIds.length;
  const totalCount = STICKERS_COLLECTION.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full text-white shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-amber-200">
                Grammar Badge & Sticker Album
              </h2>
              <p className="text-xs text-slate-400">
                Collect special achievement stickers as you complete chapters, labs, and quizzes!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">Unlocked:</span>
            <strong className="text-amber-300 font-bold">{unlockedCount} / {totalCount}</strong>
          </div>
        </div>

        {/* Grid of stickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {STICKERS_COLLECTION.map((sticker) => {
            const isUnlocked = unlockedStickerIds.includes(sticker.id);

            return (
              <div
                key={sticker.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-slate-850 border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400 hover:scale-[1.02]'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {sticker.subtitle}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border ${
                        isUnlocked
                          ? `bg-gradient-to-tr ${sticker.badgeColor} border-amber-300/40 shadow-amber-500/20`
                          : 'bg-slate-900 border-slate-800 text-slate-600 grayscale'
                      }`}
                    >
                      {sticker.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm leading-snug ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {sticker.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {sticker.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">How to earn: </span>
                  {sticker.requirement}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-5 border-t border-slate-800 mt-6">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            Close Album
          </button>
        </div>
      </div>
    </div>
  );
};
