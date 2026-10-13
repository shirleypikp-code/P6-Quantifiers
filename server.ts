import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { MULTIPLAYER_BATTLE_QUESTIONS } from './src/data/quantifierData.js';
import { LeaderboardEntry } from './src/types/game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  currentQuestion: number;
  completed: boolean;
  isHost: boolean;
  ws?: WebSocket;
}

interface Room {
  code: string;
  status: 'lobby' | 'in_game' | 'finished';
  hostId: string;
  players: Record<string, Player>;
  currentRound: number;
  createdAt: number;
}

const rooms: Record<string, Room> = {};

// In-memory persistent Leaderboard with initial school classroom records
const leaderboard: LeaderboardEntry[] = [
  {
    id: 'lb_init_1',
    playerName: 'Chloe Tan (P6-A)',
    avatar: '🦊',
    category: 'quiz',
    score: 100,
    accuracyPercent: 100,
    stickersCount: 5,
    note: 'Perfect 10/10 Mastery • Certificate Holder',
    date: 'Oct 12, 2026',
    timestamp: Date.now() - 3600000 * 24
  },
  {
    id: 'lb_init_2',
    playerName: 'Aiden Lim (P6-C)',
    avatar: '🦉',
    category: 'multiplayer',
    score: 1450,
    accuracyPercent: 100,
    stickersCount: 4,
    note: 'Multiplayer Duel Champion (10-win streak)',
    date: 'Oct 12, 2026',
    timestamp: Date.now() - 3600000 * 18
  },
  {
    id: 'lb_init_3',
    playerName: 'Maya Scribe (P6-B)',
    avatar: '🏛️',
    category: 'quiz',
    score: 100,
    accuracyPercent: 100,
    stickersCount: 5,
    note: 'Certificate Unlocked • Grammar Architect',
    date: 'Oct 13, 2026',
    timestamp: Date.now() - 3600000 * 8
  },
  {
    id: 'lb_init_4',
    playerName: 'Lucas Wang (P6-A)',
    avatar: '🧙‍♂️',
    category: 'overall',
    score: 90,
    accuracyPercent: 90,
    stickersCount: 3,
    note: 'Mastered Noun Lab & Chapters 1-2',
    date: 'Oct 13, 2026',
    timestamp: Date.now() - 3600000 * 4
  }
];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms[code] ? generateRoomCode() : code;
}

function getSafeRoom(room: Room) {
  const playersCopy: Record<string, any> = {};
  for (const [id, player] of Object.entries(room.players)) {
    playersCopy[id] = {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      score: player.score,
      streak: player.streak,
      currentQuestion: player.currentQuestion,
      completed: player.completed,
      isHost: player.isHost
    };
  }
  return {
    code: room.code,
    status: room.status,
    hostId: room.hostId,
    players: playersCopy,
    currentRound: room.currentRound,
    questions: MULTIPLAYER_BATTLE_QUESTIONS
  };
}

function broadcastToRoom(room: Room, message: object) {
  const payload = JSON.stringify(message);
  for (const player of Object.values(room.players)) {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(payload);
    }
  }
}

function broadcastGlobal(message: object) {
  const payload = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function recordLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) {
  // Check if player with same name already exists in this category
  const existingIndex = leaderboard.findIndex(
    lb => lb.playerName.toLowerCase() === entry.playerName.toLowerCase() && lb.category === entry.category
  );

  const newRecord: LeaderboardEntry = {
    id: `lb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...entry,
    timestamp: Date.now()
  };

  if (existingIndex >= 0) {
    // Only update if new score is higher or equal
    if (entry.score >= leaderboard[existingIndex].score) {
      leaderboard[existingIndex] = newRecord;
    }
  } else {
    leaderboard.push(newRecord);
  }

  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep top 100
  if (leaderboard.length > 100) {
    leaderboard.length = 100;
  }

  broadcastGlobal({
    type: 'LEADERBOARD_UPDATED',
    leaderboard
  });
}

// REST endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: Object.keys(rooms).length });
});

app.get('/api/rooms/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(getSafeRoom(room));
});

app.get('/api/leaderboard', (req, res) => {
  res.json({ leaderboard });
});

app.post('/api/leaderboard', (req, res) => {
  const { playerName, avatar, category, score, accuracyPercent, stickersCount, note, date } = req.body;
  if (!playerName || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid score entry' });
  }

  const currentDate = date || new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  recordLeaderboardEntry({
    playerName: (playerName || 'Anonymous Scholar').slice(0, 24),
    avatar: avatar || '🧙‍♂️',
    category: category || 'overall',
    score,
    accuracyPercent: typeof accuracyPercent === 'number' ? accuracyPercent : undefined,
    stickersCount: typeof stickersCount === 'number' ? stickersCount : 0,
    note: note || '',
    date: currentDate
  });

  res.json({ success: true, leaderboard });
});

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  let playerRoomCode: string | null = null;
  let registeredPlayerId: string | null = null;

  // Send current leaderboard upon connection
  ws.send(JSON.stringify({
    type: 'LEADERBOARD_UPDATED',
    leaderboard
  }));

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
        return;
      }

      if (msg.type === 'SUBMIT_SCORE') {
        const { playerName, avatar, category, score, accuracyPercent, stickersCount, note } = msg;
        if (playerName && typeof score === 'number') {
          recordLeaderboardEntry({
            playerName: (playerName || 'Player').slice(0, 24),
            avatar: avatar || '🧙‍♂️',
            category: category || 'overall',
            score,
            accuracyPercent,
            stickersCount,
            note,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          });
        }
        return;
      }

      if (msg.type === 'CREATE_ROOM') {
        const code = generateRoomCode();
        const playerId = msg.playerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const player: Player = {
          id: playerId,
          name: (msg.playerName || 'Player 1').slice(0, 18),
          avatar: msg.avatar || '🧙‍♂️',
          score: 0,
          streak: 0,
          currentQuestion: 0,
          completed: false,
          isHost: true,
          ws
        };

        const newRoom: Room = {
          code,
          status: 'lobby',
          hostId: playerId,
          players: { [playerId]: player },
          currentRound: 0,
          createdAt: Date.now()
        };

        rooms[code] = newRoom;
        playerRoomCode = code;
        registeredPlayerId = playerId;

        ws.send(JSON.stringify({
          type: 'ROOM_CREATED',
          code,
          playerId,
          room: getSafeRoom(newRoom)
        }));
        return;
      }

      if (msg.type === 'JOIN_ROOM') {
        const code = (msg.code || '').trim().toUpperCase();
        const room = rooms[code];

        if (!room) {
          ws.send(JSON.stringify({ type: 'ERROR', message: `Room ${code} was not found.` }));
          return;
        }

        const playerId = msg.playerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        playerRoomCode = code;
        registeredPlayerId = playerId;

        const isHost = room.hostId === playerId;
        const existingPlayer = room.players[playerId];

        if (existingPlayer) {
          existingPlayer.ws = ws;
          if (msg.playerName) existingPlayer.name = msg.playerName.slice(0, 18);
          if (msg.avatar) existingPlayer.avatar = msg.avatar;
        } else {
          room.players[playerId] = {
            id: playerId,
            name: (msg.playerName || `Player ${Object.keys(room.players).length + 1}`).slice(0, 18),
            avatar: msg.avatar || '🕵️‍♂️',
            score: 0,
            streak: 0,
            currentQuestion: 0,
            completed: false,
            isHost,
            ws
          };
        }

        broadcastToRoom(room, {
          type: 'ROOM_UPDATED',
          room: getSafeRoom(room)
        });
        return;
      }

      if (msg.type === 'START_MATCH') {
        const code = (msg.code || playerRoomCode || '').trim().toUpperCase();
        const room = rooms[code];
        if (!room) return;

        // Reset players for new match
        room.status = 'in_game';
        for (const p of Object.values(room.players)) {
          p.score = 0;
          p.streak = 0;
          p.currentQuestion = 0;
          p.completed = false;
        }

        broadcastToRoom(room, {
          type: 'MATCH_STARTED',
          room: getSafeRoom(room),
          questions: MULTIPLAYER_BATTLE_QUESTIONS
        });
        return;
      }

      if (msg.type === 'SUBMIT_ANSWER') {
        const code = (msg.code || playerRoomCode || '').trim().toUpperCase();
        const room = rooms[code];
        if (!room) return;

        const player = room.players[msg.playerId];
        if (!player) return;

        const isCorrect = Boolean(msg.isCorrect);
        const timeBonus = Number(msg.timeBonus) || 0;
        const basePoints = isCorrect ? 100 : 0;
        const streakBonus = isCorrect ? player.streak * 15 : 0;
        const totalPointsEarned = isCorrect ? (basePoints + timeBonus + streakBonus) : 0;

        player.score += totalPointsEarned;
        if (isCorrect) {
          player.streak += 1;
        } else {
          player.streak = 0;
        }

        player.currentQuestion = (msg.questionIndex ?? player.currentQuestion) + 1;
        if (player.currentQuestion >= MULTIPLAYER_BATTLE_QUESTIONS.length) {
          player.completed = true;
        }

        // Check if all players completed
        const allCompleted = Object.values(room.players).every(p => p.completed);
        if (allCompleted) {
          room.status = 'finished';

          // Record top players to the global leaderboard
          const sortedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
          for (const p of sortedPlayers) {
            recordLeaderboardEntry({
              playerName: p.name,
              avatar: p.avatar,
              category: 'multiplayer',
              score: p.score,
              accuracyPercent: Math.round((p.score / (MULTIPLAYER_BATTLE_QUESTIONS.length * 150)) * 100),
              stickersCount: 3,
              note: `Room ${room.code} Match • Streak: ${p.streak}`,
              date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            });
          }
        }

        broadcastToRoom(room, {
          type: 'SCORE_UPDATE',
          room: getSafeRoom(room),
          lastAnswer: {
            playerId: player.id,
            playerName: player.name,
            isCorrect,
            pointsEarned: totalPointsEarned,
            streak: player.streak
          }
        });

        if (allCompleted) {
          broadcastToRoom(room, {
            type: 'MATCH_FINISHED',
            room: getSafeRoom(room)
          });
        }
        return;
      }

      if (msg.type === 'REMATCH') {
        const code = (msg.code || playerRoomCode || '').trim().toUpperCase();
        const room = rooms[code];
        if (!room) return;

        room.status = 'in_game';
        for (const p of Object.values(room.players)) {
          p.score = 0;
          p.streak = 0;
          p.currentQuestion = 0;
          p.completed = false;
        }

        broadcastToRoom(room, {
          type: 'MATCH_STARTED',
          room: getSafeRoom(room),
          questions: MULTIPLAYER_BATTLE_QUESTIONS
        });
        return;
      }
    } catch (err) {
      console.error('WebSocket error:', err);
    }
  });

  ws.on('close', () => {
    if (playerRoomCode && registeredPlayerId && rooms[playerRoomCode]) {
      const room = rooms[playerRoomCode];
      if (room.players[registeredPlayerId]) {
        room.players[registeredPlayerId].ws = undefined;
        broadcastToRoom(room, {
          type: 'PLAYER_DISCONNECTED',
          playerId: registeredPlayerId,
          room: getSafeRoom(room)
        });
      }
    }
  });
});

// Setup Vite or static serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Quantifier Quest server running on http://localhost:${port}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
