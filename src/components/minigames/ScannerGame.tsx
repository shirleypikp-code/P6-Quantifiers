import React, { useState, useEffect } from 'react';
import { SCANNER_LEVELS, ScannerLevel } from '../../data/quantifierData';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Timer, CheckCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';

interface ScannerGameProps {
  onCompleteChapter?: () => void;
  onExit: () => void;
}

export const ScannerGame: React.FC<ScannerGameProps> = ({ onCompleteChapter, onExit }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const level: ScannerLevel = SCANNER_LEVELS[currentLevelIdx] || SCANNER_LEVELS[0];
  const totalQuantifiersInLevel = level.tokens.filter(t => t.isQuantifier).length;
  const foundQuantifiersCount = selectedIndices.filter(idx => level.tokens[idx]?.isQuantifier).length;

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, currentLevelIdx]);

  const handleTokenClick = (index: number) => {
    if (selectedIndices.includes(index) || isFinished) return;

    sounds.playClick();
    const token = level.tokens[index];
    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (token.isQuantifier) {
      sounds.playCorrect();
      const points = 100 + streak * 20;
      setScore(s => s + points);
      setStreak(st => st + 1);
      setFeedback({
        text: `Bullseye! "${token.text}" is a quantifier! ${token.explanation || ''}`,
        isCorrect: true
      });

      // Check if all quantifiers found in level
      const updatedFound = newSelected.filter(i => level.tokens[i]?.isQuantifier).length;
      if (updatedFound >= totalQuantifiersInLevel) {
        sounds.playFanfare();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      sounds.playIncorrect();
      setStreak(0);
      setFeedback({
        text: `Oops! "${token.text}" is not a quantifier. Look for words that tell "how many" or "how much".`,
        isCorrect: false
      });
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    if (currentLevelIdx + 1 < SCANNER_LEVELS.length) {
      setCurrentLevelIdx(idx => idx + 1);
      setSelectedIndices([]);
      setFeedback(null);
      setTimeLeft(45);
    } else {
      setIsFinished(true);
      if (onCompleteChapter) onCompleteChapter();
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentLevelIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setSelectedIndices([]);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl text-white">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Minigame 1: Detective Scanner
            </span>
            <span className="text-xs text-slate-400">
              Objective 1: Identify Quantifiers
            </span>
          </div>
          <h2 className="text-xl font-bold font-['Cinzel',serif] text-amber-200">
            Case #{level.id}: {level.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {level.context} Click every word that functions as a quantifier!
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-amber-300">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-white">{score} pts</span>
          </div>
          {streak > 1 && (
            <div className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 animate-bounce">
              {streak}x Combo!
            </div>
          )}
        </div>
      </div>

      {/* Target Progress Counter */}
      <div className="flex items-center justify-between bg-slate-850 p-3 rounded-xl border border-slate-800 mb-6 text-xs">
        <span className="text-slate-400">
          Quantifiers Found in Clue:
        </span>
        <span className="font-mono font-bold text-amber-400">
          {foundQuantifiersCount} / {totalQuantifiersInLevel}
        </span>
      </div>

      {!isFinished ? (
        <>
          {/* Interactive Paragraph Tokens */}
          <div className="bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-2xl mb-6 shadow-inner min-h-[160px] flex items-center justify-center">
            <div className="flex flex-wrap gap-2.5 sm:gap-3 leading-relaxed items-center justify-center max-w-2xl">
              {level.tokens.map((token, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const isCorrect = isSelected && token.isQuantifier;
                const isWrong = isSelected && !token.isQuantifier;

                return (
                  <button
                    key={idx}
                    onClick={() => handleTokenClick(idx)}
                    disabled={isSelected}
                    className={`text-base sm:text-lg font-medium px-2.5 py-1 rounded-lg transition-all transform active:scale-95 ${
                      isCorrect
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105 border border-amber-300'
                        : isWrong
                        ? 'bg-rose-900/60 text-rose-300 line-through opacity-60 border border-rose-700'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-amber-400/50 hover:shadow-sm'
                    }`}
                  >
                    {token.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border mb-6 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn ${
                feedback.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
              }`}
            >
              <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
              <div>{feedback.text}</div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-5">
            <button
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              Exit to Menu
            </button>

            {foundQuantifiersCount >= totalQuantifiersInLevel ? (
              <button
                onClick={handleNextLevel}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
              >
                <span>{currentLevelIdx + 1 < SCANNER_LEVELS.length ? 'Next Crime Scene' : 'Finish Investigation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Find {totalQuantifiersInLevel - foundQuantifiersCount} more quantifier(s) to advance!
              </span>
            )}
          </div>
        </>
      ) : (
        /* Level complete / game over screen */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-300 rounded-2xl mx-auto flex items-center justify-center border border-amber-500/40 shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-amber-200">
            Case Closed: Clues Decoded!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You successfully trained your detective eyes to identify quantifiers in complex sentences.
          </p>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
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
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
            >
              Return to Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
