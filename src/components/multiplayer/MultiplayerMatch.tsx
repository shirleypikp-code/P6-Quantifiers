import React, { useState, useEffect, useRef } from 'react';
import { MultiplayerPlayer, MultiplayerRoom, QuizQuestion } from '../../types/game';
import { MULTIPLAYER_BATTLE_QUESTIONS } from '../../data/quantifierData';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Copy, 
  Check, 
  Play, 
  Trophy, 
  Timer, 
  Flame, 
  Award, 
  Sparkles, 
  RotateCcw,
  Bot
} from 'lucide-react';

interface MultiplayerMatchProps {
  onBackToMenu: () => void;
  onGoToLeaderboard?: () => void;
}

const AVATARS = ['🧙‍♂️', '🕵️‍♀️', '🏛️', '🦉', '⚔️', '🦊', '🐉', '✨'];

export const MultiplayerMatch: React.FC<MultiplayerMatchProps> = ({ onBackToMenu, onGoToLeaderboard }) => {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('qq_player_name') || `Player_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [playerClass, setPlayerClass] = useState(() => {
    return localStorage.getItem('qq_player_class') || 'Primary 6-A';
  });
  const [playerAvatar, setPlayerAvatar] = useState('🧙‍♂️');
  const [playerId] = useState(() => `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoom | null>(null);
  const [connected, setConnected] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // In-Game state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15);
  const [lastAnswerFeedback, setLastAnswerFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Local Bot challenger state (for easy solo testing of multiplayer features)
  const [botChallengerActive, setBotChallengerActive] = useState(false);
  const [botPlayer, setBotPlayer] = useState<MultiplayerPlayer | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Parse URL query parameter for room code if opened via share link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
      setRoomCodeInput(roomFromUrl.toUpperCase());
    }
  }, []);

  // Save player name and class to local storage
  useEffect(() => {
    localStorage.setItem('qq_player_name', playerName);
    localStorage.setItem('qq_player_class', playerClass);
  }, [playerName, playerClass]);

  // Connect to WebSocket server
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Auto-join if room in URL and user already joined previously
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'ROOM_CREATED' || data.type === 'ROOM_UPDATED' || data.type === 'SCORE_UPDATE') {
          setCurrentRoom(data.room);
          setErrorMessage(null);
        } else if (data.type === 'MATCH_STARTED') {
          setCurrentRoom(data.room);
          setCurrentQuestionIdx(0);
          setSelectedOption(null);
          setHasAnsweredCurrent(false);
          setQuestionTimeLeft(15);
          setLastAnswerFeedback(null);
          sounds.playFanfare();
        } else if (data.type === 'MATCH_FINISHED') {
          setCurrentRoom(data.room);
          sounds.playFanfare();
          confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
        } else if (data.type === 'ERROR') {
          setErrorMessage(data.message);
        }
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    // Heartbeat
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 20000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, []);

  // Timer per question in active match
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'in_game' || hasAnsweredCurrent) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired, auto-submit incorrect answer
          handleOptionClick('__EXPIRED__', 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRoom?.status, currentQuestionIdx, hasAnsweredCurrent]);

  // Handle Bot challenger simulated responses in duel
  useEffect(() => {
    if (!botChallengerActive || !currentRoom || currentRoom.status !== 'in_game') return;

    const botDelay = 3000 + Math.random() * 4000;
    const botTimeout = setTimeout(() => {
      setBotPlayer(prev => {
        if (!prev) return null;
        const currentQ = MULTIPLAYER_BATTLE_QUESTIONS[currentQuestionIdx];
        if (!currentQ) return prev;

        const isCorrect = Math.random() > 0.25; // 75% accuracy
        const timeBonus = Math.floor(Math.random() * 40);
        const added = isCorrect ? (100 + timeBonus + prev.streak * 15) : 0;
        const newStreak = isCorrect ? prev.streak + 1 : 0;

        return {
          ...prev,
          score: prev.score + added,
          streak: newStreak,
          currentQuestion: currentQuestionIdx + 1,
          completed: currentQuestionIdx + 1 >= MULTIPLAYER_BATTLE_QUESTIONS.length
        };
      });
    }, botDelay);

    return () => clearTimeout(botTimeout);
  }, [botChallengerActive, currentRoom?.status, currentQuestionIdx]);

  const handleCreateRoom = () => {
    sounds.playClick();
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage("Connecting to server... Please try again in a moment.");
      return;
    }
    wsRef.current.send(JSON.stringify({
      type: 'CREATE_ROOM',
      playerId,
      playerName: playerName.trim() || 'Host',
      playerClass: playerClass.trim() || 'Primary 6-A',
      avatar: playerAvatar
    }));
  };

  const handleJoinRoom = (codeToJoin?: string) => {
    sounds.playClick();
    const code = (codeToJoin || roomCodeInput).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter a room code.");
      return;
    }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage("Connecting to server... Please try again in a moment.");
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'JOIN_ROOM',
      code,
      playerId,
      playerName: playerName.trim() || 'Player',
      playerClass: playerClass.trim() || 'Primary 6-A',
      avatar: playerAvatar
    }));
  };

  const handleCopyInviteLink = () => {
    sounds.playClick();
    if (!currentRoom) return;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${currentRoom.code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleBotChallenger = () => {
    sounds.playClick();
    if (!botChallengerActive) {
      setBotChallengerActive(true);
      setBotPlayer({
        id: 'bot_scribe',
        name: 'Scholar Rowan',
        playerClass: 'P6 Challenger',
        avatar: '🦊',
        score: 0,
        streak: 0,
        currentQuestion: 0,
        completed: false,
        isHost: false
      });
    } else {
      setBotChallengerActive(false);
      setBotPlayer(null);
    }
  };

  const handleStartMatch = () => {
    sounds.playClick();
    if (!currentRoom || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({
      type: 'START_MATCH',
      code: currentRoom.code
    }));
  };

  const handleOptionClick = (option: string, timeBonusValue?: number) => {
    if (hasAnsweredCurrent || !currentRoom) return;

    sounds.playClick();
    setSelectedOption(option);
    setHasAnsweredCurrent(true);

    const question = MULTIPLAYER_BATTLE_QUESTIONS[currentQuestionIdx];
    const isCorrect = option === question.correctAnswer;
    const bonus = timeBonusValue !== undefined ? timeBonusValue : questionTimeLeft * 5;

    if (isCorrect) {
      sounds.playCorrect();
      setLastAnswerFeedback({
        isCorrect: true,
        text: `Correct! ${question.explanation}`
      });
    } else {
      sounds.playIncorrect();
      setLastAnswerFeedback({
        isCorrect: false,
        text: `Incorrect! Answer: "${question.correctAnswer}". ${question.explanation}`
      });
    }

    // Send to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'SUBMIT_ANSWER',
        code: currentRoom.code,
        playerId,
        questionIndex: currentQuestionIdx,
        isCorrect,
        timeBonus: bonus
      }));
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < MULTIPLAYER_BATTLE_QUESTIONS.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOption(null);
      setHasAnsweredCurrent(false);
      setQuestionTimeLeft(15);
      setLastAnswerFeedback(null);
    }
  };

  const handleRematch = () => {
    sounds.playClick();
    if (!currentRoom || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({
      type: 'REMATCH',
      code: currentRoom.code
    }));
  };

  // Combine real players + local test bot for leaderboard rendering
  const allPlayersList: MultiplayerPlayer[] = currentRoom ? Object.values(currentRoom.players) : [];
  if (botChallengerActive && botPlayer) {
    allPlayersList.push(botPlayer);
  }
  // Sort by score descending
  allPlayersList.sort((a, b) => b.score - a.score);

  const me = currentRoom?.players[playerId] || {
    id: playerId,
    name: playerName,
    avatar: playerAvatar,
    score: 0,
    streak: 0,
    currentQuestion: 0,
    completed: false,
    isHost: false
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-white">
      {/* View 1: Not in Room (Host or Join) */}
      {!currentRoom && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-xs font-semibold text-indigo-300">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Multiplayer Arena</span>
            </div>
            <h1 className="text-3xl font-extrabold font-['Cinzel',serif] text-white">
              Duel with Friends
            </h1>
            <p className="text-sm text-slate-300">
              Create a match room, invite your friends with a code or link, and battle live with real-time score updates to see who wins!
            </p>
          </div>

          {/* Profile Setup */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto space-y-4">
            <div>
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
                Your Player Name: <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={24}
                placeholder="Enter your name..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
                Your Class / Section: <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={playerClass}
                onChange={(e) => setPlayerClass(e.target.value)}
                maxLength={20}
                placeholder="e.g. Primary 6-A or P6 Integrity..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Choose Avatar:
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      sounds.playClick();
                      setPlayerAvatar(av);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                      playerAvatar === av
                        ? 'bg-indigo-600 border-indigo-300 scale-110 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="max-w-md mx-auto bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          {/* Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Host Box */}
            <div className="bg-slate-850 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <h3 className="font-bold text-lg text-white font-['Cinzel',serif] mb-1">
                  Create a Match
                </h3>
                <p className="text-xs text-slate-300">
                  Generate a private room code and share link to challenge your classmates.
                </p>
              </div>
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Host New Match Room</span>
              </button>
            </div>

            {/* Join Box */}
            <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <h3 className="font-bold text-lg text-white font-['Cinzel',serif] mb-1">
                  Join with Code
                </h3>
                <p className="text-xs text-slate-300">
                  Enter the 6-character room code shared by your friend.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. LEXI99"
                  maxLength={6}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono font-bold text-amber-300 tracking-widest text-sm focus:outline-none focus:border-amber-400 uppercase"
                />
                <button
                  onClick={() => handleJoinRoom()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Room Lobby */}
      {currentRoom && currentRoom.status === 'lobby' && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">
                Multiplayer Lobby
              </span>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                Match Room: <span className="text-amber-400 font-mono tracking-wider">{currentRoom.code}</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>
          </div>

          {/* Quick share instruction */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-xs text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Share with your friend: </span>
              Tell them to enter code <span className="font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{currentRoom.code}</span> or send them the invite link!
            </div>
            {/* Quick Bot challenger button for solo testing */}
            <button
              onClick={handleToggleBotChallenger}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                botChallengerActive
                  ? 'bg-purple-900 text-purple-200 border-purple-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{botChallengerActive ? 'Challenger Bot Added' : 'Add Test Challenger Bot'}</span>
            </button>
          </div>

          {/* Players in Lobby */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Challengers in Room ({allPlayersList.length}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allPlayersList.map((player) => (
                <div
                  key={player.id}
                  className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                        <span>{player.name}</span>
                        {player.playerClass && (
                          <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">
                            {player.playerClass}
                          </span>
                        )}
                        {player.id === playerId && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 rounded">You</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {player.isHost ? 'Match Host' : 'Challenger'}
                      </span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready in lobby" />
                </div>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
            <button
              onClick={() => setCurrentRoom(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              Leave Room
            </button>

            {me.isHost || botChallengerActive ? (
              <button
                onClick={handleStartMatch}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Match!</span>
              </button>
            ) : (
              <div className="text-xs text-amber-300 italic animate-pulse">
                Waiting for the host ({allPlayersList.find(p => p.isHost)?.name || 'Host'}) to start the match...
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 3: Live Multiplayer Match */}
      {currentRoom && currentRoom.status === 'in_game' && (
        <div className="space-y-6">
          {/* Live Scoreboard Header */}
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-3">
              <span className="font-mono uppercase font-bold text-amber-400">
                Live Duel Scoreboard (Room: {currentRoom.code})
              </span>
              <span>
                Round {currentQuestionIdx + 1} of {MULTIPLAYER_BATTLE_QUESTIONS.length}
              </span>
            </div>

            {/* Players side-by-side score cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allPlayersList.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                      : 'bg-slate-850 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{p.avatar}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Q: {p.currentQuestion}/{MULTIPLAYER_BATTLE_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="font-bold text-xs truncate flex items-center justify-between">
                    <span>{p.name} {p.id === playerId ? '(You)' : ''}</span>
                    {p.playerClass && (
                      <span className="text-[9px] font-mono text-indigo-300 font-bold bg-indigo-950/80 px-1 rounded">
                        {p.playerClass}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-extrabold font-mono text-amber-300">
                      {p.score} pts
                    </span>
                    {p.streak > 1 && (
                      <span className="flex items-center text-[10px] text-amber-400 font-bold">
                        <Flame className="w-3 h-3 text-amber-400" /> {p.streak}x
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Question Box */}
          {(() => {
            const currentQ: QuizQuestion = MULTIPLAYER_BATTLE_QUESTIONS[currentQuestionIdx];
            if (!currentQ) return null;

            return (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentQ.categoryTag}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl text-xs font-mono font-bold text-amber-400 border border-slate-700">
                    <Timer className="w-3.5 h-3.5" />
                    <span>{questionTimeLeft}s</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {currentQ.prompt}
                  </h3>
                  {currentQ.contextSentence && (
                    <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl italic text-slate-300 text-sm">
                      {currentQ.contextSentence}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentQ.correctAnswer;

                    return (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        disabled={hasAnsweredCurrent}
                        className={`p-4 rounded-xl text-left font-medium text-sm transition-all border transform active:scale-98 ${
                          hasAnsweredCurrent
                            ? isCorrect
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                              : isSelected
                              ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-700 hover:border-indigo-400/60 text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {lastAnswerFeedback && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn ${
                      lastAnswerFeedback.isCorrect
                        ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div>{lastAnswerFeedback.text}</div>
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md shrink-0"
                    >
                      {currentQuestionIdx + 1 < MULTIPLAYER_BATTLE_QUESTIONS.length ? 'Next Round ›' : 'View Match Results ›'}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* View 4: Match Finished - Winner Podium */}
      {currentRoom && currentRoom.status === 'finished' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-8">
          <div className="w-20 h-20 bg-amber-500/20 text-amber-300 rounded-3xl mx-auto flex items-center justify-center border border-amber-500/40 shadow-xl animate-bounce">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Match Completed!
            </span>
            <h2 className="text-3xl font-extrabold font-['Cinzel',serif] text-white mt-1">
              {allPlayersList[0]?.name} Wins the Duel! 👑
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Final standings and score tallies for Room {currentRoom.code}
            </p>
          </div>

          {/* Podium Standings */}
          <div className="max-w-xl mx-auto space-y-3">
            {allPlayersList.map((player, rank) => (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  rank === 0
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-400 text-white shadow-lg'
                    : rank === 1
                    ? 'bg-slate-800/80 border-slate-600 text-slate-200'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold font-mono text-amber-400 w-6">
                    #{rank + 1}
                  </span>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                      <span>{player.name}</span>
                      {player.playerClass && (
                        <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">
                          {player.playerClass}
                        </span>
                      )}
                      {player.id === playerId && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1 rounded">You</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {rank === 0 ? '🏆 Champion' : rank === 1 ? '🥈 Runner-Up' : '🥉 Competitor'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono text-amber-300">
                    {player.score} pts
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Streak: {player.streak}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={handleRematch}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch</span>
            </button>
            {onGoToLeaderboard && (
              <button
                onClick={onGoToLeaderboard}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <Trophy className="w-4 h-4" />
                <span>View Leaderboard</span>
              </button>
            )}
            <button
              onClick={() => setCurrentRoom(null)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
