const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST'],
  },
});

const CHANNELS = [
  { id: 'general',   description: 'General discussion for devs' },
  { id: 'linux',     description: 'BTW I use Arch' },
  { id: 'random',    description: 'Anything goes' },
];

// in-memory storage
const channelMessages = {};
const channelUsers = {}; // channelId -> Map<socketId, username>

CHANNELS.forEach(({ id }) => {
  channelMessages[id] = [];
  channelUsers[id] = new Map();
});

const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES || '100', 10);

function addMessage(channelId, msg) {
  channelMessages[channelId].push(msg);
  if (channelMessages[channelId].length > MAX_MESSAGES) {
    channelMessages[channelId].shift();
  }
}

function getUserCount(channelId) {
  return channelUsers[channelId]?.size ?? 0;
}

function getUserCounts() {
  const counts = {};
  CHANNELS.forEach(({ id }) => {
    counts[id] = getUserCount(id);
  });
  return counts;
}

function broadcastUserCounts() {
  io.emit('user_counts', getUserCounts());
}

io.on('connection', (socket) => {
  let username = null;
  let currentChannel = null;

  socket.emit('channels', CHANNELS);
  socket.emit('user_counts', getUserCounts());

  socket.on('set_username', (raw, ack) => {
    const name = String(raw).trim().replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 20);
    if (!name) return ack?.({ error: 'invalid username' });
    username = name;
    ack?.({ ok: true, username });
  });

  socket.on('join_channel', (channelId) => {
    if (!username) return;
    const channel = CHANNELS.find((c) => c.id === channelId);
    if (!channel) return;

    // leave previous
    if (currentChannel) {
      socket.leave(currentChannel);
      channelUsers[currentChannel].delete(socket.id);
      const leaveMsg = systemMsg(currentChannel, `${username} disconnected from #${currentChannel}`);
      addMessage(currentChannel, leaveMsg);
      io.to(currentChannel).emit('new_message', leaveMsg);
    }

    currentChannel = channelId;
    socket.join(channelId);
    channelUsers[channelId].set(socket.id, username);

    // send history
    socket.emit('message_history', {
      channel: channelId,
      messages: channelMessages[channelId],
    });

    const joinMsg = systemMsg(channelId, `${username} connected to #${channelId}`);
    addMessage(channelId, joinMsg);
    io.to(channelId).emit('new_message', joinMsg);

    broadcastUserCounts();
  });

  socket.on('send_message', ({ channel, text }) => {
    if (!username || channel !== currentChannel) return;
    const content = String(text).trim().slice(0, 500);
    if (!content) return;

    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'message',
      username,
      text: content,
      timestamp: new Date().toISOString(),
      channel,
    };

    addMessage(channel, msg);
    io.to(channel).emit('new_message', msg);
  });

  socket.on('disconnect', () => {
    if (currentChannel && username) {
      channelUsers[currentChannel].delete(socket.id);
      const leaveMsg = systemMsg(currentChannel, `${username} left the terminal`);
      addMessage(currentChannel, leaveMsg);
      io.to(currentChannel).emit('new_message', leaveMsg);
      broadcastUserCounts();
    }
  });
});

function systemMsg(channel, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: 'system',
    text,
    timestamp: new Date().toISOString(),
    channel,
  };
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[DEVCHAT] server online :: port ${PORT}`);
});