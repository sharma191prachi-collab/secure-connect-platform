const appEvents = require('./appEvents');

appEvents.on('user:registered', (user) => {
  console.log(`[event] New user registered: ${user.username} (${user.email})`);
});

appEvents.on('user:loggedIn', (user) => {
  console.log(`[event] User logged in: ${user.username}`);
});

appEvents.on('note:created', (note) => {
  console.log(`[event] Note created: "${note.title}" by user ${note.owner}`);
});

appEvents.on('note:updated', (note) => {
  console.log(`[event] Note updated: "${note.title}"`);
});

appEvents.on('note:deleted', (note) => {
  console.log(`[event] Note deleted: "${note.title}"`);
});

appEvents.on('chat:message', ({ room, username }) => {
  console.log(`[event] Chat message in #${room} from ${username}`);
});
