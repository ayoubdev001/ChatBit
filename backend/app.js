import express from "express";


import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.use(errorMiddleware);

export default app;