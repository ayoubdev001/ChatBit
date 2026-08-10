# Chatbit

Real-time customer support chat application for **Souq Express**, a Moroccan e-commerce company.

Chatbit replaces slow telephone and email support with a centralized mobile chat system. Customers can create support conversations, while agents can manage and close them in real time.

## Architecture

Chatbit uses a client-server architecture with REST and WebSocket communication:

```text
+----------------------+       HTTP/REST        +-------------------------+
|   Expo Mobile App    | <--------------------> |   Node.js / Express API |
|                      |                        |                         |
| - Expo Router        |                        | - app.js               |
| - Axios              |                        | - server.js            |
| - TanStack Query     |                        | - REST routes           |
| - socket.io-client   | <--------------------> | - Socket.IO             |
+----------------------+      WebSocket         +------------+------------+
                                                             |
                                                             v
                                                   +-------------------+
                                                   |    PostgreSQL      |
                                                   | Sequelize ORM      |
                                                   | users              |
                                                   | conversations      |
                                                   | messages           |
                                                   +-------------------+
```


## Sequelize database layer

Chatbit uses **Sequelize** as its ORM for PostgreSQL. Database models define the tables and relationships, while Sequelize performs parameterized queries internally.

### Database connection

```js
// config/database.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}
```

### Model structure

```text
server/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Conversation.js
│   ├── Message.js
│   └── index.js
├── migrations/
├── seeders/
└── package.json
```

### Main models

- `User`: fullname, email, password hash, role and online status.
- `Conversation`: subject, status, customer, optional agent and closing date.
- `Message`: content, sender, conversation, read status and creation date.

### Model relationships

```js
// models/index.js
import User from './User.js';
import Conversation from './Conversation.js';
import Message from './Message.js';

User.hasMany(Conversation, {
  foreignKey: 'clientId',
  as: 'clientConversations'
});

Conversation.belongsTo(User, {
  foreignKey: 'clientId',
  as: 'client'
});

User.hasMany(Conversation, {
  foreignKey: 'agentId',
  as: 'agentConversations'
});

Conversation.belongsTo(User, {
  foreignKey: 'agentId',
  as: 'agent'
});

Conversation.hasMany(Message, {
  foreignKey: 'conversationId',
  as: 'messages'
});

Message.belongsTo(Conversation, {
  foreignKey: 'conversationId',
  as: 'conversation'
});

User.hasMany(Message, {
  foreignKey: 'senderId',
  as: 'sentMessages'
});

Message.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender'
});

export { User, Conversation, Message };
```

Use migrations instead of relying on `sequelize.sync({ alter: true })` in production. Migrations make database changes explicit and reproducible.

## Project structure

```text
chatbit/
├── mobile/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── conversations.controller.js
│   │   └── messages.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── index.js
│   ├── migrations/
│   ├── seeders/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   └── conversations.routes.js
│   ├── sockets/
│   │   ├── socket.auth.js
│   │   └── chat.handlers.js
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   ├── .sequelizerc
│   ├── package.json
│   └── package-lock.json
│
├── docs/
│   ├── use-case.puml
│   ├── class-diagram.puml
│   └── scalar.yaml
│
└── README.md
```
## Class diagram

The class diagram presents the main users, business entities, controllers and services of Chatbit.

```mermaid
classDiagram
    class User {
        +int id
        +string fullName
        +string email
        +string passwordHash
        +Role role
        +boolean isOnline
        +datetime createdAt
        +register()
        +login()
        +getProfile()
        +logout()
    }

    class Client {
        +createConversation(subject)
        +sendMessage(conversationId, content)
        +viewConversations()
        +viewMessages(conversationId)
    }

    class Agent {
        +viewPendingConversations()
        +joinConversation(conversationId)
        +sendMessage(conversationId, content)
        +closeConversation(conversationId)
    }

    class Conversation {
        +int id
        +string subject
        +ConversationStatus status
        +int clientId
        +int agentId
        +datetime createdAt
        +datetime closedAt
        +create()
        +assignAgent(agentId)
        +close()
        +addMessage(message)
    }

    class Message {
        +int id
        +int conversationId
        +int senderId
        +string content
        +boolean isRead
        +datetime sentAt
        +markAsRead()
    }

    class AuthController {
        +register(data)
        +login(email, password)
    }

    class UserController {
        +getMe(userId)
    }

    class ConversationController {
        +getConversations(userId)
        +createConversation(userId, subject)
        +getMessages(conversationId, page)
        +closeConversation(conversationId, agentId)
    }

    class AuthService {
        +hashPassword(password)
        +comparePassword(password, hash)
        +generateToken(user)
        +verifyToken(token)
    }

    class SocketService {
        +authenticateSocket(socket)
        +joinConversation(socket, conversationId)
        +leaveConversation(socket, conversationId)
        +sendMessage(socket, data)
        +startTyping(socket, conversationId)
        +stopTyping(socket, conversationId)
        +updatePresence(socket)
    }

    class Sequelize {
        +authenticate()
        +sync()
    }

    class Role {
        <<enumeration>>
        CLIENT
        AGENT
    }

    class ConversationStatus {
        <<enumeration>>
        EN_ATTENTE
        EN_COURS
        FERMEE
    }

    User <|-- Client
    User <|-- Agent

    User --> Role
    Conversation --> ConversationStatus

    Client "1" --> "0..*" Conversation : creates
    Agent "0..1" --> "0..*" Conversation : handles

    Conversation "1" *-- "0..*" Message : contains
    User "1" --> "0..*" Message : sends

    AuthController --> AuthService : uses
    AuthController --> Sequelize : accesses
    UserController --> Sequelize : accesses
    ConversationController --> Sequelize : accesses
    ConversationController --> SocketService : notifies
    SocketService --> Sequelize : persists
```


## Features

### Customer

- Register and log in.
- View the authenticated profile.
- Create a conversation with a subject.
- View conversation history.
- Send and receive messages in real time.
- See typing indicators and online presence.
- Receive a notification when an agent closes a conversation.

### Agent

- Register and log in.
- View pending and ongoing conversations.
- Take responsibility for a conversation.
- View conversation history.
- Send and receive messages in real time.
- Close a conversation.

## Technologies

### Mobile

- Expo
- Expo Router
- Axios
- TanStack Query
- socket.io-client

### Backend

- Node.js with ES Modules
- Express
- Socket.IO
- PostgreSQL
- Sequelize
- JWT
- bcrypt
- Scalar UI

## Conversation statuses

| Status | Meaning |
|---|---|
| `en_attente` | Waiting for an agent. |
| `en_cours` | Assigned to an agent and open. |
| `fermee` | Closed; new messages are forbidden. |

## REST API

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user. |
| `POST` | `/api/auth/login` | Public | Authenticate and return a JWT. |
| `GET` | `/api/users/me` | JWT | Return the current user. |
| `GET` | `/api/conversations` | JWT | List authorized conversations. |
| `POST` | `/api/conversations` | Client | Create a conversation. |
| `GET` | `/api/conversations/:id/messages` | JWT | Return paginated messages. |
| `PATCH` | `/api/conversations/:id/close` | Agent | Close a conversation. |

The REST API is documented with Scalar UI using `docs/scalar.yaml`.

## Socket.IO events

### Client to server

| Event | Payload | Description |
|---|---|---|
| `conversation:join` | `{ conversationId }` | Join an authorized room. |
| `conversation:leave` | `{ conversationId }` | Leave a room. |
| `message:send` | `{ conversationId, content }` | Send a message. |
| `typing:start` | `{ conversationId }` | Start typing indicator. |
| `typing:stop` | `{ conversationId }` | Stop typing indicator. |

### Server to client

| Event | Description |
|---|---|
| `message:new` | A saved message was broadcast. |
| `typing:update` | Typing status changed. |
| `presence:update` | Online/offline status changed. |
| `conversation:updated` | Conversation status or assignment changed. |
| `error` | An operation was rejected. |

## Environment variables

Create `server/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/chatbit
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:8081
```

Never commit the real `.env` file or JWT secret to Git.

## Installation

### 1. Install dependencies

```bash
cd server
npm install express socket.io sequelize pg pg-hstore bcrypt jsonwebtoken dotenv
npm install --save-dev nodemon sequelize-cli
```

### 2. Configure the database

Create the PostgreSQL database, configure `DATABASE_URL`, then run your Sequelize migrations:

```bash
npx sequelize-cli db:migrate
```

To undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo
```

### 3. Run the server

```bash
npm run dev
```

The `dev` script runs `server.js`, which imports `app.js`, connects to PostgreSQL and starts Express with Socket.IO:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "db:migrate": "sequelize-cli db:migrate",
    "db:migrate:undo": "sequelize-cli db:migrate:undo"
  }
}
```

### 4. Run the mobile application

Open another terminal:

```bash
cd mobile
npm install
npx expo start
```

For a physical phone, configure the mobile API URL with your computer's local network IP address instead of `localhost`.

## Development workflow

1. Configure PostgreSQL and the Sequelize environment.
2. Create and run migrations.
3. Define the User, Conversation and Message models.
4. Define model associations in `models/index.js`.
5. Implement registration and login with bcrypt and JWT.
6. Add JWT protection to REST and Socket.IO connections.
7. Implement conversation creation and assignment.
8. Implement REST message history with Sequelize queries.
9. Implement message persistence and Socket.IO broadcasting.
10. Add typing, presence, reconnection and conversation closing.

## Documentation files

- `docs/use-case.puml` — actors and use cases.
- `docs/class-diagram.puml` — main application classes and relationships.
- `docs/scalar.yaml` — OpenAPI specification for Scalar UI.

## License

This project is developed for educational purposes.
