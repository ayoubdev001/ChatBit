# ChatBit 💬
# ChatBit 💬

Real-time customer support chat application built for **Souq Express**, a Moroccan e-commerce platform.  
Replaces slow telephone/email support with an instant WhatsApp-style chat experience.

---

## Educational Goal

The core concept of this project is **WebSocket** — specifically how it differs from HTTP:

| HTTP | WebSocket |
|---|---|
| Client requests, server responds | Server pushes data without a request |
| Connection closes after each response | Connection stays open (persistent) |
| One direction per exchange | Bidirectional |
| Good for: loading pages, REST APIs | Good for: chat, notifications, live data |

---

## Stack

### Backend
- **Node.js + Express** — REST API
- **Socket.IO** — WebSocket server
- **PostgreSQL** — persistent storage
- **Sequelize** — ORM (models + sync)
- **JWT + bcrypt** — authentication
- **Scalar UI** — API documentation

### Mobile
- **Expo Router** — file-based navigation
- **Axios + TanStack Query** — REST data fetching
- **socket.io-client** — real-time connection
- **AsyncStorage** — local JWT storage
- **React Context** — auth state

---

## Features

- Register / Login with JWT authentication
- Session restore on app reboot (token persisted in AsyncStorage)
- **Client** creates a conversation with a subject → status `en_attente`
- **Agent** sees pending and ongoing conversations, joins one → status `en_cours`
- Real-time chat — history loaded via REST, new messages via Socket.IO
- Typing indicator — shows when the other person is writing
- Online/offline presence — updates on connect/disconnect
- Agent closes conversation → client notified in real time, input disabled
- Route protection — unauthenticated users can't access app screens

---

## File Structure
Real-time customer support chat application built for **Souq Express**, a Moroccan e-commerce platform.  
Replaces slow telephone/email support with an instant WhatsApp-style chat experience.

---

## Educational Goal

The core concept of this project is **WebSocket** — specifically how it differs from HTTP:

| HTTP | WebSocket |
|---|---|
| Client requests, server responds | Server pushes data without a request |
| Connection closes after each response | Connection stays open (persistent) |
| One direction per exchange | Bidirectional |
| Good for: loading pages, REST APIs | Good for: chat, notifications, live data |

---

## Stack

### Backend
- **Node.js + Express** — REST API
- **Socket.IO** — WebSocket server
- **PostgreSQL** — persistent storage
- **Sequelize** — ORM (models + sync)
- **JWT + bcrypt** — authentication
- **Scalar UI** — API documentation

### Mobile
- **Expo Router** — file-based navigation
- **Axios + TanStack Query** — REST data fetching
- **socket.io-client** — real-time connection
- **AsyncStorage** — local JWT storage
- **React Context** — auth state

---

## Features

- Register / Login with JWT authentication
- Session restore on app reboot (token persisted in AsyncStorage)
- **Client** creates a conversation with a subject → status `en_attente`
- **Agent** sees pending and ongoing conversations, joins one → status `en_cours`
- Real-time chat — history loaded via REST, new messages via Socket.IO
- Typing indicator — shows when the other person is writing
- Online/offline presence — updates on connect/disconnect
- Agent closes conversation → client notified in real time, input disabled
- Route protection — unauthenticated users can't access app screens

---

## File Structure

```
ChatBit/
```
ChatBit/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize + PostgreSQL connection
│   │   └── database.js          # Sequelize + PostgreSQL connection
│   ├── controllers/
│   │   ├── auth.controller.js   # register, login
│   │   ├── conversations.controller.js  # CRUD + close + broadcast
│   │   └── users.controller.js  # getMe, getAllAgents
│   │   ├── auth.controller.js   # register, login
│   │   ├── conversations.controller.js  # CRUD + close + broadcast
│   │   └── users.controller.js  # getMe, getAllAgents
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verify → req.user
│   │   ├── role.middleware.js   # requireRole("agent")
│   │   └── error.middleware.js  # global error handler
│   │   ├── auth.middleware.js   # JWT verify → req.user
│   │   ├── role.middleware.js   # requireRole("agent")
│   │   └── error.middleware.js  # global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── index.js             # associations
│   │   └── index.js             # associations
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── conversations.routes.js
│   │   └── users.routes.js
│   │   ├── conversations.routes.js
│   │   └── users.routes.js
│   ├── sockets/
│   │   ├── socket.auth.js       # JWT middleware for Socket.IO
│   │   └── chat.handlers.js     # all real-time event handlers
│   ├── docs/
│   │   └── scalar.yaml          # OpenAPI spec for Scalar UI
│   ├── app.js                   # Express app setup
│   ├── server.js                # HTTP + Socket.IO bootstrap
│   ├── schema.sql               # Database schema (deliverable)
│   ├── docker-compose.yml       # PostgreSQL container
│   └── .env                     # environment variables (not committed)
│
└── mobile/
    ├── app/
    │   ├── _layout.jsx          # Root layout + QueryClient + auth protection
    │   ├── (auth)/
    │   │   ├── _layout.jsx
    │   │   ├── login.jsx
    │   │   └── register.jsx
    │   └── (app)/
    │       ├── _layout.jsx
    │       ├── index.jsx         # Conversations list
    │       ├── profile.jsx
    │       ├── new-conversation.jsx
    │       └── chat/
    │           └── [id].jsx      # Real-time chat screen
    ├── api/
    │   ├── axios.js              # Axios instance + interceptors
    │   └── socket.js             # Socket.IO client + connect/disconnect
    ├── asyncstorg/
    │   └── storage.js            # AsyncStorage helpers (token)
    ├── components/
    │   ├── chat/
    │   │   ├── ChatHeader.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── MessageInput.jsx
    │   │   └── TypingIndicator.jsx
    │   ├── conversations/
    │   │   ├── ConversationCard.jsx
    │   │   ├── EmptyConversations.jsx
    │   │   └── StatusBadge.jsx
    │   └── ui/
    │       ├── Avatar.jsx
    │       ├── Button.jsx
    │       ├── ErrorMessage.jsx
    │       ├── Input.jsx
    │       └── Loading.jsx
    ├── constants/
    │   └── colors.js
    ├── context/
    │   └── AuthContext.jsx       # Auth state + session restore
    └── types/
        ├── auth.js
        ├── conversation.js
        ├── message.js
        └── user.js
```

---

## Data Model

### `schema.sql`

```sql
-- USERS
CREATE TYPE enum_users_role AS ENUM ('client', 'agent');

CREATE TABLE users (
  id              SERIAL          PRIMARY KEY,
  fullname        VARCHAR(255)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  "passwordHash"  VARCHAR(255)    NOT NULL,
  role            enum_users_role NOT NULL,
  "isOnline"      BOOLEAN         NOT NULL DEFAULT FALSE,
  "createdAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TYPE enum_conversations_status AS ENUM ('en_attente', 'en_cours', 'fermee');

CREATE TABLE conversations (
  id          SERIAL                    PRIMARY KEY,
  subject     VARCHAR(255)              NOT NULL,
  status      enum_conversations_status NOT NULL DEFAULT 'en_attente',
  "clientId"  INTEGER                   NOT NULL REFERENCES users(id),
  "agentId"   INTEGER                            REFERENCES users(id),
  "closedAt"  TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ               NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ               NOT NULL DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id                SERIAL      PRIMARY KEY,
  "conversationId"  INTEGER     NOT NULL REFERENCES conversations(id),
  "senderId"        INTEGER     NOT NULL REFERENCES users(id),
  content           TEXT        NOT NULL,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Use Case Diagram

```
                        ChatBit — Use Cases
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────┐                              ┌─────────┐         │
│   │         │── Register ─────────────────▶│         │         │
│   │         │── Login ────────────────────▶│         │         │
│   │ CLIENT  │── Create Conversation ───────▶  SYSTEM │         │
│   │         │── Send Message ─────────────▶│         │         │
│   │         │── See Typing Indicator ──────▶│         │         │
│   │         │── See Online Presence ───────▶│         │         │
│   │         │── Receive Close Notification ▶│         │         │
│   └─────────┘                              │         │         │
│                                            │         │         │
│   ┌─────────┐                              │         │         │
│   │         │── Register ─────────────────▶│         │         │
│   │         │── Login ────────────────────▶│         │         │
│   │  AGENT  │── See Pending Conversations ▶│         │         │
│   │         │── Join Conversation ─────────▶│         │         │
│   │         │── Send Message ─────────────▶│         │         │
│   │         │── Close Conversation ────────▶│         │         │
│   └─────────┘                              └─────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Class Diagram

```
<img width="783" height="1193" alt="image" src="https://github.com/user-attachments/assets/9e5fd934-a6b0-450f-8039-11ab0896b7f3" />

```

---

## ERD (Entity Relationship Diagram)

```
users                    conversations              messages
─────────────────        ──────────────────         ──────────────────
PK  id                   PK  id                     PK  id
    fullname             FK  clientId ──────────▶ users.id
    email                FK  agentId  ──────────▶ users.id  FK  conversationId ──▶ conversations.id
    passwordHash             subject             FK  senderId ────────▶ users.id
    role                     status                  content
    isOnline                 closedAt                createdAt
    createdAt                createdAt               updatedAt
    updatedAt                updatedAt
```

---

## REST Endpoints

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | ❌ | any | Create account |
| POST | `/api/auth/login` | ❌ | any | Login, get JWT |
| GET | `/api/users/me` | ✅ | any | Get current user |
| GET | `/api/conversations` | ✅ | any | List conversations |
| POST | `/api/conversations` | ✅ | client | Create conversation |
| GET | `/api/conversations/:id/messages` | ✅ | any | Message history (paginated) |
| PATCH | `/api/conversations/:id/close` | ✅ | agent | Close conversation |

API docs available at `http://localhost:3000/docs` (Scalar UI)

---

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `conversation:join` | `conversationId` | Join a room |
| `conversation:leave` | `conversationId` | Leave a room |
| `message:send` | `{ conversationId, content }` | Send a message |
| `typing:start` | `{ conversationId }` | Started typing |
| `typing:stop` | `{ conversationId }` | Stopped typing |

### Server → Client
│   │   ├── socket.auth.js       # JWT middleware for Socket.IO
│   │   └── chat.handlers.js     # all real-time event handlers
│   ├── docs/
│   │   └── scalar.yaml          # OpenAPI spec for Scalar UI
│   ├── app.js                   # Express app setup
│   ├── server.js                # HTTP + Socket.IO bootstrap
│   ├── schema.sql               # Database schema (deliverable)
│   ├── docker-compose.yml       # PostgreSQL container
│   └── .env                     # environment variables (not committed)
│
└── mobile/
    ├── app/
    │   ├── _layout.jsx          # Root layout + QueryClient + auth protection
    │   ├── (auth)/
    │   │   ├── _layout.jsx
    │   │   ├── login.jsx
    │   │   └── register.jsx
    │   └── (app)/
    │       ├── _layout.jsx
    │       ├── index.jsx         # Conversations list
    │       ├── profile.jsx
    │       ├── new-conversation.jsx
    │       └── chat/
    │           └── [id].jsx      # Real-time chat screen
    ├── api/
    │   ├── axios.js              # Axios instance + interceptors
    │   └── socket.js             # Socket.IO client + connect/disconnect
    ├── asyncstorg/
    │   └── storage.js            # AsyncStorage helpers (token)
    ├── components/
    │   ├── chat/
    │   │   ├── ChatHeader.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── MessageInput.jsx
    │   │   └── TypingIndicator.jsx
    │   ├── conversations/
    │   │   ├── ConversationCard.jsx
    │   │   ├── EmptyConversations.jsx
    │   │   └── StatusBadge.jsx
    │   └── ui/
    │       ├── Avatar.jsx
    │       ├── Button.jsx
    │       ├── ErrorMessage.jsx
    │       ├── Input.jsx
    │       └── Loading.jsx
    ├── constants/
    │   └── colors.js
    ├── context/
    │   └── AuthContext.jsx       # Auth state + session restore
    └── types/
        ├── auth.js
        ├── conversation.js
        ├── message.js
        └── user.js
```

---

## Data Model

### `schema.sql`

```sql
-- USERS
CREATE TYPE enum_users_role AS ENUM ('client', 'agent');

CREATE TABLE users (
  id              SERIAL          PRIMARY KEY,
  fullname        VARCHAR(255)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  "passwordHash"  VARCHAR(255)    NOT NULL,
  role            enum_users_role NOT NULL,
  "isOnline"      BOOLEAN         NOT NULL DEFAULT FALSE,
  "createdAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TYPE enum_conversations_status AS ENUM ('en_attente', 'en_cours', 'fermee');

CREATE TABLE conversations (
  id          SERIAL                    PRIMARY KEY,
  subject     VARCHAR(255)              NOT NULL,
  status      enum_conversations_status NOT NULL DEFAULT 'en_attente',
  "clientId"  INTEGER                   NOT NULL REFERENCES users(id),
  "agentId"   INTEGER                            REFERENCES users(id),
  "closedAt"  TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ               NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ               NOT NULL DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id                SERIAL      PRIMARY KEY,
  "conversationId"  INTEGER     NOT NULL REFERENCES conversations(id),
  "senderId"        INTEGER     NOT NULL REFERENCES users(id),
  content           TEXT        NOT NULL,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Use Case Diagram

```
                        ChatBit — Use Cases
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────┐                              ┌─────────┐         │
│   │         │── Register ─────────────────▶│         │         │
│   │         │── Login ────────────────────▶│         │         │
│   │ CLIENT  │── Create Conversation ───────▶  SYSTEM │         │
│   │         │── Send Message ─────────────▶│         │         │
│   │         │── See Typing Indicator ──────▶│         │         │
│   │         │── See Online Presence ───────▶│         │         │
│   │         │── Receive Close Notification ▶│         │         │
│   └─────────┘                              │         │         │
│                                            │         │         │
│   ┌─────────┐                              │         │         │
│   │         │── Register ─────────────────▶│         │         │
│   │         │── Login ────────────────────▶│         │         │
│   │  AGENT  │── See Pending Conversations ▶│         │         │
│   │         │── Join Conversation ─────────▶│         │         │
│   │         │── Send Message ─────────────▶│         │         │
│   │         │── Close Conversation ────────▶│         │         │
│   └─────────┘                              └─────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Class Diagram


<img width="783" height="1193" alt="image" src="https://github.com/user-attachments/assets/9e5fd934-a6b0-450f-8039-11ab0896b7f3" />



---

## ERD (Entity Relationship Diagram)

```
users                    conversations              messages
─────────────────        ──────────────────         ──────────────────
PK  id                   PK  id                     PK  id
    fullname             FK  clientId ──────────▶ users.id
    email                FK  agentId  ──────────▶ users.id  FK  conversationId ──▶ conversations.id
    passwordHash             subject             FK  senderId ────────▶ users.id
    role                     status                  content
    isOnline                 closedAt                createdAt
    createdAt                createdAt               updatedAt
    updatedAt                updatedAt
```

---

## REST Endpoints

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | ❌ | any | Create account |
| POST | `/api/auth/login` | ❌ | any | Login, get JWT |
| GET | `/api/users/me` | ✅ | any | Get current user |
| GET | `/api/conversations` | ✅ | any | List conversations |
| POST | `/api/conversations` | ✅ | client | Create conversation |
| GET | `/api/conversations/:id/messages` | ✅ | any | Message history (paginated) |
| PATCH | `/api/conversations/:id/close` | ✅ | agent | Close conversation |

API docs available at `http://localhost:3000/docs` (Scalar UI)

---

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `conversation:join` | `conversationId` | Join a room |
| `conversation:leave` | `conversationId` | Leave a room |
| `message:send` | `{ conversationId, content }` | Send a message |
| `typing:start` | `{ conversationId }` | Started typing |
| `typing:stop` | `{ conversationId }` | Stopped typing |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `message:new` | `{ id, conversationId, senderId, content, createdAt }` | New message broadcast |
| `typing:update` | `{ userId, conversationId, isTyping }` | Typing status |
| `presence:update` | `{ userId, isOnline }` | Online/offline status |
| `conversation:updated` | `{ conversationId, status, agentId? }` | Status changed |
| `error` | `{ code, message }` | Server-side error |

---

## Key Server Rules

- Socket connection **refused** without valid JWT — middleware `io.use(socketAuth)`
- `userId` is always taken from the verified JWT — **never trusted from the client**
- A user can only join rooms where they are the assigned client or agent
- `message:send` on a closed (`fermee`) conversation → `error` event
- **INSERT in database before broadcast** — persistence before real-time

---

## message:send Flow

```
Client emits message:send
        ↓
Verify JWT (already done at connection — socket.user is trusted)
        ↓
Find conversation in PostgreSQL
        ↓
Check user is a participant (clientId or agentId)
        ↓
Check conversation is not "fermee"
        ↓
Message.create() — INSERT into PostgreSQL
        ↓
io.to("conversation:X").emit("message:new") — broadcast to room
        ↓
Both client and agent receive the message simultaneously
```

---

## Conversation Status Flow

```
[Client creates conversation]
        ↓
   en_attente  ←── waiting for an agent
        ↓
[Agent joins via conversation:join]
        ↓
    en_cours   ←── active chat
        ↓
[Agent calls PATCH /conversations/:id/close]
        ↓
     fermee    ←── closed, no more messages allowed
        ↓
[Server emits conversation:updated to room]
        ↓
[Client UI disables MessageInput]
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- Expo Go app on your phone

### Backend
| `message:new` | `{ id, conversationId, senderId, content, createdAt }` | New message broadcast |
| `typing:update` | `{ userId, conversationId, isTyping }` | Typing status |
| `presence:update` | `{ userId, isOnline }` | Online/offline status |
| `conversation:updated` | `{ conversationId, status, agentId? }` | Status changed |
| `error` | `{ code, message }` | Server-side error |

---

## Key Server Rules

- Socket connection **refused** without valid JWT — middleware `io.use(socketAuth)`
- `userId` is always taken from the verified JWT — **never trusted from the client**
- A user can only join rooms where they are the assigned client or agent
- `message:send` on a closed (`fermee`) conversation → `error` event
- **INSERT in database before broadcast** — persistence before real-time

---

## message:send Flow

```
Client emits message:send
        ↓
Verify JWT (already done at connection — socket.user is trusted)
        ↓
Find conversation in PostgreSQL
        ↓
Check user is a participant (clientId or agentId)
        ↓
Check conversation is not "fermee"
        ↓
Message.create() — INSERT into PostgreSQL
        ↓
io.to("conversation:X").emit("message:new") — broadcast to room
        ↓
Both client and agent receive the message simultaneously
```

---

## Conversation Status Flow

```
[Client creates conversation]
        ↓
   en_attente  ←── waiting for an agent
        ↓
[Agent joins via conversation:join]
        ↓
    en_cours   ←── active chat
        ↓
[Agent calls PATCH /conversations/:id/close]
        ↓
     fermee    ←── closed, no more messages allowed
        ↓
[Server emits conversation:updated to room]
        ↓
[Client UI disables MessageInput]
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- Expo Go app on your phone

### Backend

```bash
cd backend

# Start PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start the server
cd backend

# Start PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start the server
npm run dev
```

Server runs at `http://localhost:3000`  
API docs at `http://localhost:3000/docs`
Server runs at `http://localhost:3000`  
API docs at `http://localhost:3000/docs`

### Mobile
### Mobile

```bash
cd mobile

# Install dependencies

# Install dependencies
npm install

# Update the IP in api/axios.js and api/socket.js
# Replace 192.168.1.108 with your machine's local IP

# Start Expo
npm start

# Scan the QR code with Expo Go
```

### Environment Variables

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=chatbit

JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

---

## Authentication Flow

```
Register → bcrypt hashes password → stored in DB
Login    → bcrypt compares → JWT signed → returned to client
           ↓
Mobile saves JWT to AsyncStorage
           ↓
Axios interceptor reads token → adds Authorization header to every request
           ↓
Socket connects → sends token in handshake auth → socketAuth verifies it
           ↓
App restarts → getToken() finds JWT → getMe() restores session → socket reconnects
```

---

## Project Context

**Souq Express** is a growing Moroccan e-commerce platform that previously managed customer support by telephone and email — slow, no centralized history, no real-time communication.

**ChatBit** solves this by providing:
- A mobile interface for customers to open support conversations
- A real-time agent dashboard to handle multiple conversations
- Instant message delivery via WebSocket
- Full message history persisted in PostgreSQL
- Typing indicators and presence for a WhatsApp-like experience

---

*ChatBit — Souq Express Customer Support · Built with Expo + Node.js + Socket.IO + PostgreSQL*

# Update the IP in api/axios.js and api/socket.js
# Replace 192.168.1.108 with your machine's local IP

# Start Expo
npm start

# Scan the QR code with Expo Go
```

---

## Authentication Flow

```
Register → bcrypt hashes password → stored in DB
Login    → bcrypt compares → JWT signed → returned to client
           ↓
Mobile saves JWT to AsyncStorage
           ↓
Axios interceptor reads token → adds Authorization header to every request
           ↓
Socket connects → sends token in handshake auth → socketAuth verifies it
           ↓
App restarts → getToken() finds JWT → getMe() restores session → socket reconnects
```

---

## Project Context

**Souq Express** is a growing Moroccan e-commerce platform that previously managed customer support by telephone and email — slow, no centralized history, no real-time communication.

**ChatBit** solves this by providing:
- A mobile interface for customers to open support conversations
- A real-time agent dashboard to handle multiple conversations
- Instant message delivery via WebSocket
- Full message history persisted in PostgreSQL
- Typing indicators and presence for a WhatsApp-like experience

---

*ChatBit — Souq Express Customer Support · Built with Expo + Node.js + Socket.IO + PostgreSQL*
