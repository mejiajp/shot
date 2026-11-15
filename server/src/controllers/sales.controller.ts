import { Request, Response } from "express";
import { getTotalService, getBarService } from "../services/sales.service";

// top products
export const getTotal = async (req: Request, res: Response) => {
  const query = req.query.method;

  try {
    const response = await getTotalService(query);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// get specific id
export const getBar = async (req: Request, res: Response) => {
  try {
    const monthlyTotals = await getBarService();

    res.json(monthlyTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
