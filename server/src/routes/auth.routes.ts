import { Router } from "express";

import {
  signIn,
  getMe,
  logout,
  authenticateToken,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signin", signIn);

router.get("/me", authenticateToken, getMe);

router.post("/logout", logout);

export default router;
