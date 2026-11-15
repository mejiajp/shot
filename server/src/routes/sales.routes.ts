import express from "express";
import { getTotal, getBar } from "../controllers/sales.controller";

const router = express.Router();

router.get("/total", getTotal);
router.get("/bar", getBar);

export default router;
