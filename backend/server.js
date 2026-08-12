import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDatabase, sequelize } from "./config/database.js";
import "./models/index.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();

  // creates/updates tables to match models 
  await sequelize.sync({ alter: true });
  console.log("Tables synced.");

  // Create an HTTP server using your Express app
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();