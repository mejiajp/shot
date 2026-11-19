import { Request, Response } from "express";

import {
  getAllOrders,
  getTopProducts as getTopProductsService,
  getTopProductsWeek as getTopProductsWeekService,
  getBreakdown as getBreakdownService,
  createOrder as createOrderService,
} from "../services/orders.service";

// GET ALL ORDERS
export const getOrders = async (req: Request, res: Response) => {
  try {
    const ordersData = await getAllOrders();

    return res.status(200).json(ordersData);
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
};

// TOP PRODUCTS
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const orderedProducts = await getTopProductsService();

    return res.status(200).json(orderedProducts);
  } catch (error) {
    console.error("Failed to fetch top products:", error);

    return res.status(500).json({
      error: "Failed to fetch top products",
    });
  }
};

// TOP PRODUCTS WEEK
export const getTopProductsWeek = async (req: Request, res: Response) => {
  try {
    const orderedProducts = await getTopProductsWeekService();

    return res.status(200).json(orderedProducts);
  } catch (error) {
    console.error("Failed to fetch weekly top products:", error);

    return res.status(500).json({
      error: "Failed to fetch weekly top products",
    });
  }
};

// BREAKDOWN
export const getBreakdown = async (req: Request, res: Response) => {
  try {
    const breakdown = await getBreakdownService();

    return res.status(200).json(breakdown);
  } catch (error) {
    console.error("Failed to fetch product breakdown:", error);

    return res.status(500).json({
      error: "Failed to fetch product breakdown",
    });
  }
};

// CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await createOrderService(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Failed to save order:", error);

    return res.status(500).json({
      error: "Failed to save order",
    });
  }
};
