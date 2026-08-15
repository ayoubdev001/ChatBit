import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDatabase, sequelize } from "./config/database.js";
import "./models/index.js";
import { socketAuth } from "./sockets/socket.auth.js";
import { registerChatHandlers } from "./sockets/chat.handlers.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();

  await sequelize.sync({ alter: true });
  console.log("Tables synced.");

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // JWT check before every connection
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`Socket connected: userId=${socket.user.userId} role=${socket.user.role}`);
    registerChatHandlers(io, socket);
  });

  // Let REST controllers access io (used in closeConversation)
  app.set("io", io);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API docs:     http://localhost:${PORT}/docs`);
  });
}

startServer();