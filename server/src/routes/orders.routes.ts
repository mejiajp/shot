import express from "express";

import {
  getOrders,
  getTopProducts,
  getTopProductsWeek,
  getBreakdown,
  createOrder,
} from "../controllers/orders.controller";

const router = express.Router();

router.get("/", getOrders);

router.get("/top", getTopProducts);

router.get("/topweek", getTopProductsWeek);

router.get("/breakdown", getBreakdown);

router.post("/create", createOrder);

export default router;
