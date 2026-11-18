import { Request, Response } from "express";
import { getTotalService, getBarService } from "../services/sales.service";
import type { SalesMetric } from "../types/sales.types";

// Validate sales metrics
const isSalesMetric = (value: unknown): value is SalesMetric => {
  return value === "sales" || value === "transaction" || value === "average";
};

// GET SALES TOTALS
export const getTotal = async (req: Request, res: Response) => {
  const method = req.query.method;

  if (!isSalesMetric(method)) {
    return res.status(400).json({
      error: "Invalid method. Use sales, transaction, or average.",
    });
  }

  try {
    const response = await getTotalService(method);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Failed to fetch sales totals:", error);

    return res.status(500).json({
      error: "Failed to fetch sales data",
    });
  }
};

// GET MONTHLY SALES
export const getBar = async (req: Request, res: Response) => {
  try {
    const monthlyTotals = await getBarService();

    return res.status(200).json(monthlyTotals);
  } catch (error) {
    console.error("Failed to fetch monthly sales:", error);

    return res.status(500).json({
      error: "Failed to fetch monthly sales data",
    });
  }
};
