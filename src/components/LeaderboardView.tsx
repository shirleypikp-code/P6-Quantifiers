import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Medal, 
  Award, 
  Search, 
  RefreshCw, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface LeaderboardViewProps {
  currentUserName: string;
  currentUserAvatar: string;
  bestQuizScore: number;
  unlockedStickersCount: number;
  onGoToQuiz: () => void;
  onGoToMultiplayer: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUserName,
  currentUserAvatar,
  bestQuizScore,
  unlockedStickersCount,
  onGoToQuiz,
  onGoToMultiplayer
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'quiz' | 'multiplayer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmittedMyScore, setHasSubmittedMyScore] = useState(false);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data.leaderboard && Array.isArray(data.leaderboard)) {
          setEntries(data.leaderboard);
        }
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handlePostMyScore = async () => {
    sounds.playClick();
    if (bestQuizScore === 0) return;

    try {
      const payload = {
        playerName: currentUserName,
        avatar: currentUserAvatar,
        category: 'quiz',
        score: bestQuizScore,
        accuracyPercent: bestQuizScore,
        stickersCount: unlockedStickersCount,
        note: bestQuizScore >= 95 ? '95%+ Certificate Holder' : 'Quiz Scholar',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        sounds.playFanfare();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setHasSubmittedMyScore(true);
        fetchLeaderboard();
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesCat = filterCategory === 'all' || entry.category === filterCategory;
    const matchesSearch = entry.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.note && entry.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const topThree = filteredEntries.slice(0, 3);
  const remaining = filteredEntries.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-white">
      {/* Header */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Primary 6 Hall of Fame
              </span>
              <span className="text-xs text-slate-400">
                Live Score Rankings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] text-white">
              Grammar Quest Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              See how everyone ranks across the 10-Item Quiz and multiplayer friend matches!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                fetchLeaderboard();
              }}
              disabled={isLoading}
              className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {bestQuizScore > 0 && (
              <button
                onClick={handlePostMyScore}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hasSubmittedMyScore ? 'Score Updated' : 'Submit My Score'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or class (e.g. Chloe, P6, Lucas)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            {(['all', 'quiz', 'multiplayer'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Modes' : cat === 'quiz' ? 'Quiz 95%+' : 'Duel Matches'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium Showcase */}
        {topThree.length > 0 && (
          <div className="pt-2 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="bg-slate-850/80 border border-slate-700 rounded-2xl p-4 text-center order-2 sm:order-1 relative shadow-md">
                  <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-500 text-slate-200 mx-auto -mt-8 flex items-center justify-center font-bold text-sm shadow">
                    🥈 2
                  </div>
                  <div className="text-3xl my-2">{topThree[1].avatar}</div>
                  <h4 className="font-bold text-sm text-white truncate">{topThree[1].playerName}</h4>
                  <div className="text-base font-extrabold font-mono text-slate-200 mt-1">
                    {topThree[1].score} {topThree[1].category === 'quiz' ? '%' : 'pts'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {topThree[1].stickersCount ? `⭐ ${topThree[1].stickersCount} stickers` : topThree[1].date}
                  </div>
                </div>
              )}

              {/* 1st Place Champion */}
              {topThree[0] && (
                <div className="bg-gradient-to-b from-amber-500/20 via-slate-850 to-slate-900 border-2 border-amber-400 rounded-3xl p-5 text-center order-1 sm:order-2 relative shadow-xl transform sm:-translate-y-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 mx-auto -mt-10 flex items-center justify-center font-black text-base shadow-lg border-2 border-amber-200 animate-pulse">
                    🥇 1
                  </div>
                  <div className="text-4xl my-2 animate-bounce">{topThree[0].avatar}</div>
                  <h3 className="font-extrabold text-base text-amber-200 truncate">{topThree[0].playerName}</h3>
                  <div className="text-xl font-black font-mono text-amber-400 mt-1">
                    {topThree[0].score} {topThree[0].category === 'quiz' ? '%' : 'pts'}
                  </div>
                  <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full mt-1">
                    Champion
                  </span>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="bg-slate-850/80 border border-slate-700 rounded-2xl p-4 text-center order-3 sm:order-3 relative shadow-md">
                  <div className="w-10 h-10 rounded-full bg-amber-900/80 border border-amber-700 text-amber-200 mx-auto -mt-8 flex items-center justify-center font-bold text-sm shadow">
                    🥉 3
                  </div>
                  <div className="text-3xl my-2">{topThree[2].avatar}</div>
                  <h4 className="font-bold text-sm text-white truncate">{topThree[2].playerName}</h4>
                  <div className="text-base font-extrabold font-mono text-amber-300 mt-1">
                    {topThree[2].score} {topThree[2].category === 'quiz' ? '%' : 'pts'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {topThree[2].stickersCount ? `⭐ ${topThree[2].stickersCount} stickers` : topThree[2].date}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            All Recorded Scores ({filteredEntries.length})
          </h3>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {filteredEntries.map((entry, index) => {
              const isCurrentUser = entry.playerName.toLowerCase() === currentUserName.toLowerCase();

              return (
                <div
                  key={entry.id || index}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isCurrentUser
                      ? 'bg-amber-500/15 border-amber-400 shadow-md text-white'
                      : 'bg-slate-850/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-400 w-6 text-center">
                      #{index + 1}
                    </span>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {entry.playerName}
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-1.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {entry.note || (entry.category === 'quiz' ? '10-Item Quiz' : 'Multiplayer Match')} • {entry.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {entry.stickersCount !== undefined && entry.stickersCount > 0 && (
                      <span className="hidden sm:inline-flex items-center text-xs font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        ⭐ {entry.stickersCount}
                      </span>
                    )}

                    <div className="text-right">
                      <div className="font-extrabold font-mono text-base text-amber-300">
                        {entry.score} {entry.category === 'quiz' ? '%' : 'pts'}
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {entry.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching score records found. Play the Quiz or a Multiplayer Duel to post your score!
              </div>
            )}
          </div>
        </div>

        {/* Quick Mode Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5 text-xs text-slate-400">
          <div>
            Want to climb the ranks? Earn 100% on the Quiz or challenge classmates in a Duel!
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onGoToQuiz();
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-lg border border-slate-700"
            >
              Take Quiz
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onGoToMultiplayer();
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow"
            >
              Play Duel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
