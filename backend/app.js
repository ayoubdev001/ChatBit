import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { apiReference } from "@scalar/express-api-reference";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const openApiSpec = JSON.parse(
  readFileSync(new URL("./docs/scalar.yaml", import.meta.url), "utf8")
);
app.use("/docs", apiReference({ spec: { content: openApiSpec } }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorMiddleware);

export default app;