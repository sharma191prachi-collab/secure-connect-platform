# Lab 4 - Secure Connect and Communication Platform

Stack: Node.js, Express, JWT, bcrypt, dotenv, Socket.IO, MongoDB (mongoose)

## Run kaise kare
1. Node.js (v18+) aur MongoDB install/chalu hona chahiye
   (ya MongoDB Atlas ka free URI `.env` ke `MONGO_URI` me daalo).
2. Is folder me terminal kholo:
       npm install
       npm start
3. Console me `[server] listening on http://localhost:5000` aana chahiye.

## Postman tests
| Request | Body / Header | Expected |
|---|---|---|
| POST /api/auth/signup | {"username":"victor","email":"victor@example.com","password":"123456"} | 201 User registered |
| POST /api/auth/login | {"email":"victor@example.com","password":"123456"} | 200 Login successful + token |
| GET /api/notes (bina token) | - | 403 No token provided |
| POST /api/notes | Authorization: Bearer <token> + {"title":"My First Note","content":"..."} | 201 note |
| GET /api/notes | Authorization: Bearer <token> | 200 notes list |
| PUT /api/notes/:id | Bearer token + {"title":"new"} | 200 updated |
| DELETE /api/notes/:id | Bearer token | 200 Note deleted |
| GET /api/admin/users | admin token | 200 (normal user ko 403) |

Admin banane ke liye `.env` ke `ADMIN_EMAIL` wali email se signup karo.

## Chat test
Browser me http://localhost:5000 kholo, 2 alag tabs me alag users se login karo,
same room (general) join karke message bhejo. Server console me chat logs dikhenge.

## Folder structure
config/ db connection | models/ User, Note, Message | middleware/ JWT + RBAC
routes/ auth, notes, admin, profile | sockets/ chat | events/ EventEmitter | public/ chat UI
