import React from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  Users, 
  HelpCircle, 
  Award, 
  BookMarked, 
  Volume2, 
  VolumeX, 
  Sparkles,
  PenTool,
  FlaskConical,
  Trophy
} from 'lucide-react';
import { sounds } from '../utils/audio';

export type AppTab = 'chapters' | 'noun_lab' | 'minigames' | 'multiplayer' | 'quiz' | 'leaderboard' | 'reflection' | 'codex';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  quizScorePercent: number;
  hasPassed95: boolean;
  unlockedStickersCount: number;
  onOpenCertificate: () => void;
  onOpenStickerAlbum: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  quizScorePercent,
  hasPassed95,
  unlockedStickersCount,
  onOpenCertificate,
  onOpenStickerAlbum
}) => {
  const [soundOn, setSoundOn] = React.useState(sounds.isSoundEnabled());

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
  };

  interface NavItem {
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'chapters', label: 'Story Chapters', icon: BookOpen },
    { id: 'noun_lab', label: 'Noun Lab', icon: FlaskConical, badge: 'New' },
    { id: 'minigames', label: 'Minigames', icon: Gamepad2 },
    { id: 'multiplayer', label: 'Play with Friends', icon: Users, badge: 'Duel' },
    { id: 'quiz', label: '10-Item Quiz', icon: HelpCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Rank' },
    { id: 'reflection', label: 'Reflection', icon: PenTool },
    { id: 'codex', label: 'Codex', icon: BookMarked },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('chapters')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-amber-100 to-indigo-200 bg-clip-text text-transparent font-['Cinzel',serif]">
                Quantifier Quest
              </div>
              <div className="text-[9px] tracking-widest uppercase text-amber-400/80 font-semibold font-mono">
                Primary 6 Edition
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/40 text-indigo-300 border border-indigo-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions: Sticker Album CTA + Certificate CTA + Sound Toggle */}
          <div className="flex items-center gap-2">
            {/* Sticker Album button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenStickerAlbum();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
              title="Open your Sticker Album"
            >
              <span className="text-sm">⭐</span>
              <span className="hidden sm:inline">Stickers</span>
              <span className="text-[10px] font-mono bg-slate-900 text-amber-400 px-1.5 py-0.2 rounded">
                {unlockedStickersCount}/5
              </span>
            </button>

            {/* Certificate button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCertificate();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                hasPassed95
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 animate-pulse hover:scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/40'
              }`}
              title={hasPassed95 ? "Certificate unlocked! Click to view" : "Reach 95% on the quiz to unlock certificate"}
            >
              <Award className={`w-3.5 h-3.5 ${hasPassed95 ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="hidden md:inline">Certificate</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${hasPassed95 ? 'bg-amber-700 text-white' : 'bg-slate-900 text-amber-400'}`}>
                {quizScorePercent}%
              </span>
            </button>

            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors border border-slate-700/80"
              title={soundOn ? 'Mute Sound' : 'Enable Sound'}
              aria-label={soundOn ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Submenu Navigation */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-800 gap-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
