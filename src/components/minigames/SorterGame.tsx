import React, { useState, useEffect } from 'react';
import { SORTER_ITEMS, SorterItem } from '../../data/quantifierData';
import { QuantifierCategory } from '../../types/game';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, CheckCircle2, XCircle, Award } from 'lucide-react';

interface SorterGameProps {
  onCompleteChapter?: () => void;
  onExit: () => void;
}

export const SorterGame: React.FC<SorterGameProps> = ({ onCompleteChapter, onExit }) => {
  const [items, setItems] = useState<SorterItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; reason: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Shuffle sorter items for replayability
    const shuffled = [...SORTER_ITEMS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, []);

  const currentItem = items[currentIndex];

  const handleSort = (chosenCategory: QuantifierCategory) => {
    if (!currentItem || isFinished) return;

    sounds.playClick();
    const isCorrect = currentItem.category === chosenCategory;

    if (isCorrect) {
      sounds.playCorrect();
      const points = 120 + streak * 25;
      setScore(s => s + points);
      setStreak(st => st + 1);
      setLastResult({
        isCorrect: true,
        reason: `Perfect! "${currentItem.label}" ${currentItem.reason}`
      });
    } else {
      sounds.playIncorrect();
      setStreak(0);
      setLastResult({
        isCorrect: false,
        reason: `Mismatched! "${currentItem.label}" belongs in ${
          currentItem.category === 'countable'
            ? 'Countable Chamber'
            : currentItem.category === 'uncountable'
            ? 'Uncountable Cauldron'
            : 'Dual Vault (Both)'
        }. ${currentItem.reason}`
      });
    }

    if (currentIndex + 1 < items.length) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      if (onCompleteChapter) onCompleteChapter();
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    const shuffled = [...SORTER_ITEMS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setLastResult(null);
    setIsFinished(false);
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Minigame 2: Cauldron Sorter
            </span>
            <span className="text-xs text-slate-400">
              Objective 2: Countable vs Uncountable
            </span>
          </div>
          <h2 className="text-xl font-bold font-['Cinzel',serif] text-emerald-300">
            Master Caelum's Alchemical Scale
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sort the reagent quantifier into Countable, Uncountable, or Dual (Works with both).
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-white">{score} pts</span>
          </div>
          {streak > 1 && (
            <div className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 animate-pulse">
              {streak}x Combo!
            </div>
          )}
          <div className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>

      {!isFinished && currentItem ? (
        <div className="space-y-6">
          {/* Active Card to sort */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
            <div className="text-4xl mb-3 animate-bounce">{currentItem.icon}</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              Quantifier Reagent
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300 my-2">
              "{currentItem.label}"
            </div>
            <div className="text-xs text-slate-400">
              Which category does this quantifier strictly or flexibly modify?
            </div>
          </div>

          {/* Three Choice Chambers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Countable Chamber */}
            <button
              onClick={() => handleSort('countable')}
              className="p-5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 hover:border-blue-400 text-left transition-all group transform active:scale-95 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🔢</span>
                  <span className="text-[10px] font-mono text-blue-300 uppercase px-2 py-0.5 rounded bg-blue-900/40">
                    Plural Nouns
                  </span>
                </div>
                <h4 className="font-bold text-white group-hover:text-blue-200 text-base">
                  Countable Only
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  e.g., apples, vials, coins, crystals, hours
                </p>
              </div>
              <div className="text-[11px] font-bold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
                Sort Here ›
              </div>
            </button>

            {/* Uncountable Cauldron */}
            <button
              onClick={() => handleSort('uncountable')}
              className="p-5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group transform active:scale-95 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💧</span>
                  <span className="text-[10px] font-mono text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-900/40">
                    Mass / Liquid
                  </span>
                </div>
                <h4 className="font-bold text-white group-hover:text-emerald-200 text-base">
                  Uncountable Only
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  e.g., water, dust, advice, magic, time, luggage
                </p>
              </div>
              <div className="text-[11px] font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                Sort Here ›
              </div>
            </button>

            {/* Dual Vault */}
            <button
              onClick={() => handleSort('both')}
              className="p-5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400 text-left transition-all group transform active:scale-95 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">⚖️</span>
                  <span className="text-[10px] font-mono text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-900/40">
                    Flexible
                  </span>
                </div>
                <h4 className="font-bold text-white group-hover:text-purple-200 text-base">
                  Dual Vault (Both)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Works with both countable & uncountable nouns
                </p>
              </div>
              <div className="text-[11px] font-bold text-purple-400 mt-4 group-hover:translate-x-1 transition-transform">
                Sort Here ›
              </div>
            </button>
          </div>

          {/* Result explanation box */}
          {lastResult && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
                lastResult.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
              }`}
            >
              {lastResult.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>{lastResult.reason}</div>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-slate-800 pt-4">
            <button
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Exit to Menu
            </button>
            <span className="text-xs text-slate-500">
              Tip: Advice, furniture, and luggage are always uncountable!
            </span>
          </div>
        </div>
      ) : (
        /* Sorter Complete */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-2xl mx-auto flex items-center justify-center border border-emerald-500/40 shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-emerald-300">
            Alchemist's Balance Mastered!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You successfully sorted countable, uncountable, and dual quantifiers without exploding a single potion!
          </p>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {score} Points Earned
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onExit}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
            >
              Return to Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
