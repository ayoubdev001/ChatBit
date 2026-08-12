import express from "express";
import { readFileSync } from "fs";
import { apiReference } from "@scalar/express-api-reference";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

// ---- Health check ----
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---- Scalar API docs ----
const openApiSpec = JSON.parse(
  readFileSync(new URL("./docs/scalar.yaml", import.meta.url))
);

app.use(
  "/docs",
  apiReference({
    spec: { content: openApiSpec },
  })
);

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorMiddleware);

export default app;