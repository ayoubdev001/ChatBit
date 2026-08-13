import { Router } from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  closeConversation,
} from "../controllers/conversations.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

// GET /api/conversations — any authenticated user (client or agent), filtered by role inside the controller
router.get("/", authMiddleware, getConversations);

// POST /api/conversations — client only
router.post("/", authMiddleware, requireRole("client"), createConversation);

// GET /api/conversations/:id/messages — any authenticated user (client or agent)
router.get("/:id/messages", authMiddleware, getMessages);

// PATCH /api/conversations/:id/close — only agent can close convo
router.patch("/:id/close", authMiddleware, requireRole("agent"), closeConversation);

export default router;