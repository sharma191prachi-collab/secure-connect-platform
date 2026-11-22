
# Secure Connect and Communication Platform

**Course:** Web Dev III | **Lab:** 4 (Unit 4)

A secure Node.js backend that lets users sign up, log in, access protected resources, manage personal notes, and chat in real time. Authentication, authorization and chat are all built by hand, with no pre-built auth or chat frameworks.

## Features

- **Signup and login** with passwords hashed using bcrypt
- **JWT authentication** for stateless sessions (token accepted via `Authorization: Bearer` header or `token` cookie)
- **Protected routes** that reject requests without a valid token
- **Role-based access control (RBAC)** with `user` and `admin` roles
- **Secure Notes API** with full CRUD; each user can only access their own notes
- **Real-time chat** using Socket.IO with JWT-authenticated connections and rooms
- **Event-driven logging** using Node.js `EventEmitter`
- **Environment variables** managed with dotenv

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Server-side runtime |
| Express.js | Routing and middleware |
| jsonwebtoken | JWT creation and verification |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| Socket.IO | Real-time, bidirectional communication |
| MongoDB (Mongoose) | Data persistence |

## Project Structure

```
secure-connect-platform/
├── config/
│   └── db.js              # MongoDB connection
├── events/
│   ├── appEvents.js       # Shared EventEmitter instance
│   └── listeners.js       # Event listeners (logging)
├── middleware/
│   └── auth.js            # verifyToken and requireRole (RBAC)
├── models/
│   ├── User.js
│   ├── Note.js
│   └── Message.js
├── routes/
│   ├── auth.js            # Signup, login, logout
│   ├── notes.js           # Notes CRUD (protected)
│   ├── profile.js         # Logged-in user profile (protected)
│   └── admin.js           # Admin-only routes (RBAC)
├── sockets/
│   └── chat.js            # Socket.IO chat logic
├── public/
│   └── index.html         # Simple chat client for testing
├── .env.example
├── package.json
└── server.js
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A MongoDB database (local installation or a free MongoDB Atlas cluster)

### Installation

```bash
git clone <your-repository-url>
cd secure-connect-platform
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/secure_connect
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime (for example `1h`) |
| `ADMIN_EMAIL` | A user who signs up with this email receives the `admin` role |

> The `.env` file is listed in `.gitignore` and must never be committed.

### Run the Server

```bash
npm start
```

Expected console output:

```
[db] MongoDB connected
[server] listening on http://localhost:5000
```

## API Reference

### Authentication

| Method | Endpoint | Body | Success Response |
|---|---|---|---|
| POST | `/api/auth/signup` | `username`, `email`, `password` | `201` User registered |
| POST | `/api/auth/login` | `email`, `password` | `200` Login successful + `token` |
| POST | `/api/auth/logout` | none | `200` Logged out |

### Protected Routes

All routes below require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Current user profile |
| POST | `/api/notes` | Create a note (`title`, `content`) |
| GET | `/api/notes` | List your notes |
| GET | `/api/notes/:id` | Get one of your notes |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/admin/users` | List all users (**admin only**) |
| GET | `/api/admin/notes` | List all notes (**admin only**) |

Send the token as a header:

```
Authorization: Bearer <your-token>
```

### Error Responses

| Status | Meaning |
|---|---|
| `400` | Missing or invalid input |
| `401` | Invalid credentials, or invalid/expired token |
| `403` | No token provided, or insufficient role |
| `404` | Resource not found |
| `409` | Username or email already in use |

## Real-Time Chat (Socket.IO)

Connections must provide a valid JWT during the handshake:

```js
const socket = io({ auth: { token } });
```

| Direction | Event | Payload | Description |
|---|---|---|---|
| Client to server | `joinRoom` | `room` | Join a chat room |
| Client to server | `chatMessage` | `{ room, text }` | Send a message |
| Server to client | `history` | array of messages | Last 20 messages when joining |
| Server to client | `chatMessage` | `{ room, username, text, createdAt }` | New message in a room |
| Server to client | `system` | string | Join notifications |

To try the chat, open `http://localhost:5000` in two browser windows (one can be incognito), log in as two different users, join the same room and send messages.

## Event-Driven Features

A shared `EventEmitter` instance emits events that are handled in `events/listeners.js`:

`user:registered`, `user:loggedIn`, `note:created`, `note:updated`, `note:deleted`, `chat:message`

## Testing with Postman

1. `POST /api/auth/signup` to create a user
2. `POST /api/auth/login` to receive a token
3. `GET /api/notes` without a token returns `403 No token provided`
4. `POST /api/notes` with the Bearer token returns `201 Created`
5. `GET /api/notes` with the Bearer token returns `200 OK` with your notes

## Security Notes

- Passwords are hashed with bcrypt and never stored in plain text
- JWTs are signed with a secret kept in environment variables
- Notes are scoped to their owner on every query
- Admin routes are protected by role checks
- The session cookie is `httpOnly` and `sameSite: strict`
- Chat messages are rendered with `textContent` in the client to prevent XSS

## Author

Prachi
