const EventEmitter = require('events');

// Ek shared EventEmitter poori app mein use hota hai
class AppEvents extends EventEmitter {}
module.exports = new AppEvents();
