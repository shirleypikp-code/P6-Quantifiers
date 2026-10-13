import React, { useState } from 'react';
import { ScannerGame } from './ScannerGame';
import { SorterGame } from './SorterGame';
import { SentenceDashGame } from './SentenceDashGame';
import { Search, FlaskConical, Compass, Play, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface MinigameHubProps {
  initialGameId?: string | null;
  onCompleteChapter: (chapterId: number) => void;
}

export const MinigameHub: React.FC<MinigameHubProps> = ({
  initialGameId = null,
  onCompleteChapter
}) => {
  const [activeGame, setActiveGame] = useState<string | null>(initialGameId);

  const games = [
    {
      id: 'scanner',
      title: "Lexi's Clue Scanner",
      chapterId: 1,
      objective: "Objective 1: Identify quantifiers in given texts",
      description: "Step into crime scenes across Quantville. Rapidly inspect witness statements and manuscripts to detect every hidden quantifier before the clock runs out!",
      icon: Search,
      badge: "Chapter 1",
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
      btnColor: "bg-amber-500 hover:bg-amber-400 text-slate-950"
    },
    {
      id: 'sorter',
      title: "The Cauldron Sorter",
      chapterId: 2,
      objective: "Objective 2: Distinguish countable vs uncountable nouns & quantifiers",
      description: "Balance Master Caelum's magical scale! Sort ingredients and quantifiers into the Countable Chamber, Uncountable Cauldron, or the Dual Vault.",
      icon: FlaskConical,
      badge: "Chapter 2",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300",
      btnColor: "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
    },
    {
      id: 'sentence_dash',
      title: "Architect's Inscription Dash",
      chapterId: 3,
      objective: "Objective 3: Use quantifiers appropriately in sentences",
      description: "Carve grammatically sound quantifiers into ancient library pillars. Master delicate nuances between 'few' vs 'a few', 'some' vs 'any', and noun agreement.",
      icon: Compass,
      badge: "Chapter 3",
      color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
      btnColor: "bg-indigo-600 hover:bg-indigo-500 text-white"
    }
  ];

  if (activeGame === 'scanner') {
    return (
      <ScannerGame
        onCompleteChapter={() => onCompleteChapter(1)}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  if (activeGame === 'sorter') {
    return (
      <SorterGame
        onCompleteChapter={() => onCompleteChapter(2)}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  if (activeGame === 'sentence_dash') {
    return (
      <SentenceDashGame
        onCompleteChapter={() => onCompleteChapter(3)}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Grammar Arcade</span>
        </div>
        <h1 className="text-3xl font-extrabold font-['Cinzel',serif] text-white">
          The Minigame Arena
        </h1>
        <p className="text-sm text-slate-300">
          Choose a challenge to put your quantifier knowledge to the test. Each minigame targets a specific grammar objective!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              className={`bg-gradient-to-b ${g.color} bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all hover:scale-[1.02] group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-700 text-slate-300">
                    {g.badge}
                  </span>
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold font-['Cinzel',serif] text-white mb-2">
                  {g.title}
                </h3>
                <div className="text-xs font-semibold text-amber-400/90 mb-3">
                  {g.objective}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveGame(g.id);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs shadow-lg transition-transform active:scale-95 ${g.btnColor}`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Challenge</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
