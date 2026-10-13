import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../data/quantifierData';
import { Chapter } from '../types/game';
import { 
  Sparkles, 
  Lightbulb, 
  Gamepad2, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  FlaskConical, 
  Compass,
  BookOpen,
  Lock,
  Award,
  FlaskRound
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ChapterViewProps {
  onStartMinigame: (minigameId: string) => void;
  onGoToQuiz: () => void;
  onGoToNounLab: () => void;
  completedChapters: number[];
  unlockedStickerIds: string[];
  onOpenStickerAlbum: () => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  onStartMinigame,
  onGoToQuiz,
  onGoToNounLab,
  completedChapters,
  unlockedStickerIds,
  onOpenStickerAlbum
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const currentChapter = CHAPTERS_DATA.find(c => c.id === selectedChapterId) || CHAPTERS_DATA[0];

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const isChapterUnlocked = (chId: number): boolean => {
    if (chId === 1) return true;
    return completedChapters.includes(chId - 1);
  };

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'amber':
        return {
          bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentBorder: 'border-amber-500/40',
          gradient: 'from-amber-500/20 via-slate-900 to-slate-950',
          btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
          highlight: 'text-amber-400 font-bold bg-amber-400/10 px-1 py-0.5 rounded'
        };
      case 'emerald':
        return {
          bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          accentBorder: 'border-emerald-500/40',
          gradient: 'from-emerald-500/20 via-slate-900 to-slate-950',
          btnPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
          highlight: 'text-emerald-400 font-bold bg-emerald-400/10 px-1 py-0.5 rounded'
        };
      case 'indigo':
      default:
        return {
          bgBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          accentBorder: 'border-indigo-500/40',
          gradient: 'from-indigo-500/20 via-slate-900 to-slate-950',
          btnPrimary: 'bg-indigo-500 hover:bg-indigo-400 text-slate-950',
          highlight: 'text-indigo-400 font-bold bg-indigo-400/10 px-1 py-0.5 rounded'
        };
    }
  };

  const themeStyles = getThemeColors(currentChapter.theme);
  const isCurrentDone = completedChapters.includes(currentChapter.id);
  const hasSticker = unlockedStickerIds.includes(currentChapter.rewardSticker.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Chapter Selection Bar with Lock Mechanism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CHAPTERS_DATA.map((ch) => {
          const isSelected = ch.id === currentChapter.id;
          const isDone = completedChapters.includes(ch.id);
          const unlocked = isChapterUnlocked(ch.id);

          return (
            <button
              key={ch.id}
              disabled={!unlocked}
              onClick={() => {
                if (unlocked) {
                  sounds.playClick();
                  setSelectedChapterId(ch.id);
                } else {
                  sounds.playIncorrect();
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : unlocked
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer'
                  : 'bg-slate-950/70 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Chapter 0{ch.id}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Mastered
                    </span>
                  ) : !unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400/90 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                      <Lock className="w-3 h-3" /> Complete Ch {ch.id - 1} First
                    </span>
                  ) : null}
                </div>
                <div className={`p-2 rounded-xl border ${
                  isSelected 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : unlocked 
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  {unlocked ? getChapterIcon(ch.icon) : <Lock className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              <h3 className={`font-bold text-base transition-colors ${
                unlocked ? 'text-white group-hover:text-amber-200' : 'text-slate-500'
              }`}>
                {ch.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {unlocked ? ch.objective : `Locked until Chapter ${ch.id - 1} is completed!`}
              </p>

              {/* Sticker badge indicator */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-base">{ch.rewardSticker.icon}</span>
                <span className={unlockedStickerIds.includes(ch.rewardSticker.id) ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                  {unlockedStickerIds.includes(ch.rewardSticker.id) ? 'Sticker Earned' : 'Sticker Reward'}
                </span>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Chapter Content Card */}
      <div className={`bg-gradient-to-b ${themeStyles.gradient} border ${themeStyles.accentBorder} rounded-3xl p-6 sm:p-8 shadow-2xl relative`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${themeStyles.bgBadge}`}>
                Chapter {currentChapter.id} of 3
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentChapter.subtitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] text-white">
              {currentChapter.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {currentChapter.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Sticker Preview / Status button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenStickerAlbum();
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all"
            >
              <span className="text-lg">{currentChapter.rewardSticker.icon}</span>
              <span>{hasSticker ? 'Sticker Unlocked!' : 'Reward Sticker'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onStartMinigame(currentChapter.minigameId);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all transform hover:scale-105 ${themeStyles.btnPrimary}`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Minigame & Earn Sticker</span>
            </button>
          </div>
        </div>

        {/* Narrative Box with Character Dialogue */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-4 items-start shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-md shrink-0">
            {currentChapter.narrative.avatar}
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 text-sm">
                {currentChapter.narrative.character}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded font-mono">
                Primary 6 Briefing
              </span>
            </div>
            {currentChapter.narrative.story.map((paragraph, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Special Chapter 2 Feature: Countable vs Uncountable Noun Lab CTA */}
        {currentChapter.id === 2 && (
          <div className="mb-8 p-5 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl">
                🧪
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  Recommended Training: Countable vs Uncountable Noun Lab
                </h4>
                <p className="text-xs text-slate-300">
                  Practice sorting nouns (water, advice, pencils, homework) before testing your quantifiers!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onGoToNounLab();
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Launch Noun Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Key Rules & Lessons */}
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Cinzel',serif]">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Core Mastery Principles
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {currentChapter.keyRules.map((rule, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {rule.explanation}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Applied Examples:
                    </span>
                    <div className="space-y-1.5">
                      {rule.examples.map((ex, exIdx) => (
                        <div 
                          key={exIdx} 
                          className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-200"
                        >
                          <span className="text-amber-400 font-semibold mr-1.5">›</span>
                          {ex.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {rule.proTip && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2 mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Pro-Tip: </span>
                      {rule.proTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-6">
          <button
            onClick={() => {
              sounds.playClick();
              onStartMinigame(currentChapter.minigameId);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-sm transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Launch {currentChapter.minigameName}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentChapter.id < 3 ? (
              isCurrentDone ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedChapterId(currentChapter.id + 1);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
                >
                  <span>Continue to Chapter {currentChapter.id + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Complete Chapter {currentChapter.id} minigame to unlock Chapter {currentChapter.id + 1}!</span>
                </div>
              )
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onGoToQuiz();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all"
              >
                <span>Take the 10-Item Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
