import { Router } from "express";
import { getAllAgents, getMe } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/me", authMiddleware, getMe);
router.get("/agents", authMiddleware, getAllAgents);

export default router;