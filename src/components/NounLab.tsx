import React, { useState } from 'react';
import { NOUN_ITEMS } from '../data/quantifierData';
import { NounItem } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  FlaskConical, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Lightbulb, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface NounLabProps {
  onUnlockNounSticker?: () => void;
  onGoToChapter2?: () => void;
}

export const NounLab: React.FC<NounLabProps> = ({ onUnlockNounSticker, onGoToChapter2 }) => {
  const [items, setItems] = useState<NounItem[]>(() => {
    return [...NOUN_ITEMS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    isCorrect: boolean;
    noun: NounItem;
    userChoice: boolean;
  } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentNoun = items[currentIndex];

  const handleClassify = (choseCountable: boolean) => {
    if (!currentNoun || lastFeedback !== null || isFinished) return;

    sounds.playClick();
    const isCorrect = choseCountable === currentNoun.isCountable;

    if (isCorrect) {
      sounds.playCorrect();
      const points = 100 + streak * 20;
      setScore(s => s + points);
      setStreak(st => st + 1);
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);

      if (newCorrect === 10 && onUnlockNounSticker) {
        onUnlockNounSticker();
      }
    } else {
      sounds.playIncorrect();
      setStreak(0);
    }

    setLastFeedback({
      isCorrect,
      noun: currentNoun,
      userChoice: choseCountable
    });
  };

  const handleNextNoun = () => {
    sounds.playClick();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(i => i + 1);
      setLastFeedback(null);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      if (correctCount >= 10 && onUnlockNounSticker) {
        onUnlockNounSticker();
      }
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setItems([...NOUN_ITEMS].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setLastFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-white">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                Interactive Grammar Laboratory
              </span>
              <span className="text-xs text-slate-400">
                Primary 6 Foundation Skill
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] text-cyan-200">
              Countable & Uncountable Noun Lab
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Before choosing quantifiers like <em>few, a few, fewer, less,</em> or <em>much</em>, test whether the noun is countable or uncountable!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-white">{score} pts</span>
            </div>
            {streak > 1 && (
              <div className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-xs font-bold text-cyan-300 animate-pulse">
                {streak}x Combo!
              </div>
            )}
            <div className="text-xs font-mono text-slate-400">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>

        {/* Primary 6 Quick Test Helper Card */}
        <div className="bg-slate-950/70 border border-cyan-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-300">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-cyan-300">The Primary 6 Quick Rule: </span>
            Countable nouns can be counted with numbers (<em>1 book, 2 books</em>). Uncountable nouns are liquids, masses, or ideas that cannot be counted directly (<em>water, homework, advice</em>).
          </div>
        </div>

        {!isFinished && currentNoun ? (
          <div className="space-y-6">
            {/* Active Noun Display Card */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-xl relative">
              <div className="text-5xl mb-3 animate-bounce">{currentNoun.icon}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                Analyze This Noun
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 my-2">
                "{currentNoun.noun}"
              </div>
              <p className="text-xs text-slate-400">
                Can you tally individual items, or is it a continuous substance / idea?
              </p>
            </div>

            {/* Classification Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleClassify(true)}
                disabled={lastFeedback !== null}
                className={`p-6 rounded-2xl border text-left transition-all transform active:scale-98 shadow-md flex flex-col justify-between group ${
                  lastFeedback
                    ? currentNoun.isCountable
                      ? 'bg-blue-950/80 border-blue-400 text-blue-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                    : 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/30 hover:border-blue-400 text-white hover:scale-[1.01]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🔢</span>
                    <span className="text-[10px] font-mono uppercase bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                      Separate Units
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-200">
                    Countable Noun
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Can count: 1, 2, 3... Has singular and plural forms with "-s".
                  </p>
                </div>
                <div className="text-xs font-bold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Takes: few • a few • fewer • many
                </div>
              </button>

              <button
                onClick={() => handleClassify(false)}
                disabled={lastFeedback !== null}
                className={`p-6 rounded-2xl border text-left transition-all transform active:scale-98 shadow-md flex flex-col justify-between group ${
                  lastFeedback
                    ? !currentNoun.isCountable
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 hover:border-emerald-400 text-white hover:scale-[1.01]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">💧</span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded">
                      Mass / Liquid
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-200">
                    Uncountable Noun
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Cannot count directly. Measured in volume, mass, or concepts.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Takes: little • a little • less • much
                </div>
              </button>
            </div>

            {/* Feedback & Quantifier Pairing Guide */}
            {lastFeedback && (
              <div
                className={`p-5 rounded-2xl border text-xs sm:text-sm animate-fadeIn space-y-3 ${
                  lastFeedback.isCorrect
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                    : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {lastFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-white text-sm mb-1">
                      {lastFeedback.isCorrect ? 'Correct Classification!' : 'Not Quite!'} "{lastFeedback.noun.noun}" is {lastFeedback.noun.isCountable ? 'COUNTABLE' : 'UNCOUNTABLE'}.
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">
                      {lastFeedback.noun.explanation}
                    </p>
                  </div>
                </div>

                {/* Quantifier Compatibility Ribbon */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-amber-300">Recommended Quantifiers: </span>
                    <span className="font-mono text-white">
                      {lastFeedback.noun.exampleQuantifiers.join(', ')}
                    </span>
                  </div>
                  <button
                    onClick={handleNextNoun}
                    className="w-full sm:w-auto px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>{currentIndex + 1 < items.length ? 'Next Noun' : 'Complete Lab'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completed Lab Screen */
          <div className="text-center py-8 space-y-5">
            <div className="w-20 h-20 bg-cyan-500/20 text-cyan-300 rounded-3xl mx-auto flex items-center justify-center border border-cyan-500/40 shadow-xl animate-bounce">
              <Award className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Lab Complete
              </span>
              <h2 className="text-3xl font-extrabold font-['Cinzel',serif] text-white mt-1">
                Noun Classification Mastered!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                You successfully tested and categorized {correctCount} nouns! You unlocked the <strong>Noun Science Specialist Sticker 🧪</strong>.
              </p>
            </div>

            <div className="text-3xl font-extrabold font-mono text-cyan-300">
              {score} Points Earned
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
              {onGoToChapter2 && (
                <button
                  onClick={onGoToChapter2}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
                >
                  Continue to Chapter 2: The Alchemist's Scale
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
