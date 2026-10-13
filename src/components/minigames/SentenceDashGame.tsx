import React, { useState } from 'react';
import { SENTENCE_DASH_ITEMS, SentenceDashItem } from '../../data/quantifierData';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, CheckCircle2, XCircle, Award, Compass } from 'lucide-react';

interface SentenceDashGameProps {
  onCompleteChapter?: () => void;
  onExit: () => void;
}

export const SentenceDashGame: React.FC<SentenceDashGameProps> = ({ onCompleteChapter, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem: SentenceDashItem = SENTENCE_DASH_ITEMS[currentIndex] || SENTENCE_DASH_ITEMS[0];

  const handleSelectOption = (choice: string) => {
    if (feedback !== null || isFinished) return;

    sounds.playClick();
    const isCorrect = choice.toLowerCase() === currentItem.correct.toLowerCase();

    if (isCorrect) {
      sounds.playCorrect();
      const points = 150 + streak * 30;
      setScore(s => s + points);
      setStreak(st => st + 1);
      setFeedback({
        isCorrect: true,
        text: `Keystone Locked! "${choice}" is correct. ${currentItem.hint}`
      });
    } else {
      sounds.playIncorrect();
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Pillar Trembles! The correct keystone was "${currentItem.correct}". ${currentItem.hint}`
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex + 1 < SENTENCE_DASH_ITEMS.length) {
      setCurrentIndex(i => i + 1);
      setFeedback(null);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 75, spread: 85, origin: { y: 0.65 } });
      if (onCompleteChapter) onCompleteChapter();
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              Minigame 3: Sentence Dash
            </span>
            <span className="text-xs text-slate-400">
              Objective 3: Use Quantifiers Appropriately
            </span>
          </div>
          <h2 className="text-xl font-bold font-['Cinzel',serif] text-indigo-300">
            Grand Architect's Inscription Dash
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the exact quantifier to complete the library's ancient pillars!
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-mono font-bold text-white">{score} pts</span>
          </div>
          {streak > 1 && (
            <div className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-xs font-bold text-indigo-300 animate-bounce">
              {streak}x Combo!
            </div>
          )}
          <div className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {SENTENCE_DASH_ITEMS.length}
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Sentence Display Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 rounded-2xl shadow-inner text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-mono uppercase tracking-widest mb-4">
              <Compass className="w-4 h-4" />
              <span>Pillar Context: {currentItem.nounType} Focus</span>
            </div>

            <p className="text-xl sm:text-2xl font-medium text-slate-200 leading-relaxed">
              "{currentItem.sentenceBefore}{' '}
              <span className="inline-block px-4 py-1 mx-1.5 bg-indigo-950/80 border-b-2 border-indigo-400 font-mono font-bold text-indigo-300 rounded shadow-inner">
                {feedback ? currentItem.correct : '_______'}
              </span>{' '}
              {currentItem.sentenceAfter}"
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentItem.options.map((option) => {
              const isSelected = feedback !== null;
              const isCorrectOption = option.toLowerCase() === currentItem.correct.toLowerCase();

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={isSelected}
                  className={`p-4 rounded-xl text-left font-mono text-base font-semibold transition-all border transform active:scale-98 ${
                    feedback
                      ? isCorrectOption
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 hover:border-indigo-400/60 text-white hover:text-indigo-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {feedback && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Feedback Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn ${
                feedback.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>{feedback.text}</div>
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md shrink-0 transition-transform active:scale-95"
              >
                {currentIndex + 1 < SENTENCE_DASH_ITEMS.length ? 'Next Inscription' : 'Finish Pillars'}
              </button>
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
              Check if the noun is countable or uncountable before placing the quantifier!
            </span>
          </div>
        </div>
      ) : (
        /* Game Over Complete Screen */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-indigo-500/20 text-indigo-300 rounded-2xl mx-auto flex items-center justify-center border border-indigo-500/40 shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-indigo-300">
            Grand Library Pillars Restored!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You successfully applied quantifiers in sentences with grammatical precision.
          </p>
          <div className="text-3xl font-extrabold font-mono text-indigo-400">
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
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Return to Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
