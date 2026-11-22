const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const appEvents = require('../events/appEvents');

module.exports = function initChat(io) {
  // Socket.IO handshake pe JWT verify hota hai
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('No token provided'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async (room) => {
      room = String(room || 'general').trim().slice(0, 30) || 'general';
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);

      // pichhle 20 messages bhejo
      const history = await Message.find({ room }).sort({ createdAt: -1 }).limit(20);
      socket.emit('history', history.reverse());
      io.to(room).emit('system', `${socket.user.username} joined #${room}`);
    });

    socket.on('chatMessage', async ({ room, text } = {}) => {
      room = String(room || 'general').trim();
      text = String(text || '').trim().slice(0, 500);
      if (!text || !socket.rooms.has(room)) return;

      const msg = await Message.create({ room, username: socket.user.username, text });
      console.log(`[${room}] ${socket.user.username}: ${text}`);
      appEvents.emit('chat:message', { room, username: socket.user.username });

      io.to(room).emit('chatMessage', {
        room,
        username: msg.username,
        text: msg.text,
        createdAt: msg.createdAt,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
