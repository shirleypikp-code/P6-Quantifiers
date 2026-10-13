/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { ChapterView } from './components/ChapterView';
import { NounLab } from './components/NounLab';
import { MinigameHub } from './components/minigames/MinigameHub';
import { MultiplayerMatch } from './components/multiplayer/MultiplayerMatch';
import { QuizSection } from './components/QuizSection';
import { ReflectionSection } from './components/ReflectionSection';
import { CodexModal } from './components/CodexModal';
import { CertificateModal } from './components/CertificateModal';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { LeaderboardView } from './components/LeaderboardView';
import { STICKERS_COLLECTION } from './data/quantifierData';
import { Sticker, UserProfile } from './types/game';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Award, 
  Gamepad2, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  FlaskConical,
  Trophy
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chapters');
  const [initialMinigame, setInitialMinigame] = useState<string | null>(null);

  // Student Profile Identification State (Name, Class, Avatar)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('qq_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const legacyName = localStorage.getItem('qq_player_name');
    const legacyClass = localStorage.getItem('qq_player_class');
    return {
      name: legacyName || '',
      className: legacyClass || 'Primary 6-A',
      avatar: '🧙‍♂️'
    };
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(() => {
    const saved = localStorage.getItem('qq_student_profile');
    const legacyName = localStorage.getItem('qq_player_name');
    return !saved && !legacyName;
  });

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('qq_student_profile', JSON.stringify(profile));
    localStorage.setItem('qq_player_name', profile.name);
    localStorage.setItem('qq_player_class', profile.className);
    setIsInitialSetup(false);
  };
  
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    const saved = localStorage.getItem('qq_completed_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('qq_unlocked_stickers');
    return saved ? JSON.parse(saved) : [];
  });

  const [newlyUnlockedSticker, setNewlyUnlockedSticker] = useState<Sticker | null>(null);
  const [showStickerAlbum, setShowStickerAlbum] = useState(false);

  const [bestQuizScore, setBestQuizScore] = useState<number>(() => {
    const saved = localStorage.getItem('qq_quiz_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Auto-switch to multiplayer if URL has ?room=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('room')) {
      setActiveTab('multiplayer');
    }
  }, []);

  const awardSticker = (stickerId: string) => {
    if (!unlockedStickerIds.includes(stickerId)) {
      const updated = [...unlockedStickerIds, stickerId];
      setUnlockedStickerIds(updated);
      localStorage.setItem('qq_unlocked_stickers', JSON.stringify(updated));

      const sticker = STICKERS_COLLECTION.find(s => s.id === stickerId);
      if (sticker) {
        setNewlyUnlockedSticker(sticker);
        sounds.playFanfare();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleStartMinigame = (minigameId: string) => {
    setInitialMinigame(minigameId);
    setActiveTab('minigames');
  };

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      const updated = [...completedChapters, chapterId];
      setCompletedChapters(updated);
      localStorage.setItem('qq_completed_chapters', JSON.stringify(updated));
    }
    // Award the chapter sticker!
    awardSticker(`sticker-ch${chapterId}`);
  };

  const handleQuizComplete = (scorePercent: number) => {
    if (scorePercent > bestQuizScore) {
      setBestQuizScore(scorePercent);
      localStorage.setItem('qq_quiz_score', scorePercent.toString());
    }
    if (scorePercent >= 95) {
      awardSticker('sticker-quiz-95');
    }
  };

  const hasPassed95 = bestQuizScore >= 95;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'minigames') {
            setInitialMinigame(null);
          }
          setActiveTab(tab);
        }}
        quizScorePercent={bestQuizScore}
        hasPassed95={hasPassed95}
        unlockedStickersCount={unlockedStickerIds.length}
        userProfile={userProfile}
        onOpenCertificate={() => setShowCertificateModal(true)}
        onOpenStickerAlbum={() => setShowStickerAlbum(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Hero Banner only shown on Chapters tab */}
        {activeTab === 'chapters' && (
          <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-600/15 border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary 6 Grammar Quest • Progressive Chapter Locking & Stickers</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight text-white">
                  Master the Art of Quantifiers
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join Inspector Lexi, Master Caelum, and Architect Soren! Master tricky Primary 6 quantifiers: <strong>few, a few, fewer, less, little, a little, much,</strong> and <strong>a lot of</strong>. Complete each chapter in order to unlock the next one and collect all 5 official stickers!
                </p>

                {/* Progress Indicators */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Chapters Completed: </span>
                    <strong className="text-amber-300 font-mono">{completedChapters.length}/3</strong>
                  </div>
                  <button
                    onClick={() => setShowStickerAlbum(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-850 rounded-xl border border-amber-500/40 text-amber-300 transition-colors"
                  >
                    <span>⭐ Stickers Collected: </span>
                    <strong className="font-mono">{unlockedStickerIds.length}/5</strong>
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-700">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Quiz Score: </span>
                    <strong className="text-amber-300 font-mono">{bestQuizScore}%</strong>
                    <span className="text-[10px] text-slate-400">(≥95% for certificate)</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('noun_lab');
                  }}
                  className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group flex flex-col justify-between"
                >
                  <FlaskConical className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-white">Noun Lab</div>
                    <div className="text-[10px] text-slate-400">Countable vs Uncountable</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('multiplayer');
                  }}
                  className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all group flex flex-col justify-between"
                >
                  <Users className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-white">Duel Friends</div>
                    <div className="text-[10px] text-slate-400">Share code or link</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'chapters' && (
          <ChapterView
            onStartMinigame={handleStartMinigame}
            onGoToQuiz={() => {
              sounds.playClick();
              setActiveTab('quiz');
            }}
            onGoToNounLab={() => {
              sounds.playClick();
              setActiveTab('noun_lab');
            }}
            completedChapters={completedChapters}
            unlockedStickerIds={unlockedStickerIds}
            onOpenStickerAlbum={() => setShowStickerAlbum(true)}
          />
        )}

        {activeTab === 'noun_lab' && (
          <NounLab
            onUnlockNounSticker={() => awardSticker('sticker-noun-lab')}
            onGoToChapter2={() => {
              sounds.playClick();
              setActiveTab('chapters');
            }}
          />
        )}

        {activeTab === 'minigames' && (
          <MinigameHub
            initialGameId={initialMinigame}
            onCompleteChapter={handleCompleteChapter}
          />
        )}

        {activeTab === 'multiplayer' && (
          <MultiplayerMatch
            onBackToMenu={() => setActiveTab('chapters')}
            onGoToLeaderboard={() => {
              sounds.playClick();
              setActiveTab('leaderboard');
            }}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizSection
            onQuizComplete={handleQuizComplete}
            onOpenCertificate={() => setShowCertificateModal(true)}
            onGoToReflection={() => {
              sounds.playClick();
              setActiveTab('reflection');
            }}
            onGoToLeaderboard={() => {
              sounds.playClick();
              setActiveTab('leaderboard');
            }}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            currentUserName={userProfile.name || 'Scholar ' + Math.floor(100 + Math.random() * 900)}
            currentUserClass={userProfile.className || 'Primary 6-A'}
            currentUserAvatar={userProfile.avatar || '🧙‍♂️'}
            bestQuizScore={bestQuizScore}
            unlockedStickersCount={unlockedStickerIds.length}
            onGoToQuiz={() => {
              sounds.playClick();
              setActiveTab('quiz');
            }}
            onGoToMultiplayer={() => {
              sounds.playClick();
              setActiveTab('multiplayer');
            }}
          />
        )}

        {activeTab === 'reflection' && (
          <ReflectionSection
            hasPassed95={hasPassed95}
            onOpenCertificate={() => setShowCertificateModal(true)}
            onGoToChapters={() => setActiveTab('chapters')}
          />
        )}

        {activeTab === 'codex' && (
          <CodexModal isEmbedded={true} />
        )}
      </main>

      {/* Student Identification Profile Modal */}
      <StudentProfileModal
        isOpen={showProfileModal || isInitialSetup}
        onClose={() => {
          if (!isInitialSetup) {
            setShowProfileModal(false);
          }
        }}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        isInitialSetup={isInitialSetup}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        quizScorePercent={bestQuizScore}
        onRetakeQuiz={() => {
          setShowCertificateModal(false);
          setActiveTab('quiz');
        }}
      />

      {/* Sticker Album Modal */}
      <StickerAlbumModal
        isOpen={showStickerAlbum}
        onClose={() => setShowStickerAlbum(false)}
        unlockedStickerIds={unlockedStickerIds}
        newlyUnlockedSticker={newlyUnlockedSticker}
        onClearNewSticker={() => setNewlyUnlockedSticker(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Quantifier Quest (Primary 6)</strong> • Grammar Mastery Platform
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Focal Quantifiers: few • a few • fewer • less • little • a little • much • a lot of</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
