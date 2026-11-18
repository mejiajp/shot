import { PrismaClient } from "@prisma/client";
import subtractMonths from "../lib/subtractMonths";

import type {
  SalesMetric,
  SalesTotals,
  DailySales,
  SalesRecord,
  SalesSummaryResponse,
  MonthlySales,
} from "../types/sales.types";

const prisma = new PrismaClient();

// GET SALES TOTALS
export const getTotalService = async (
  method: SalesMetric
): Promise<SalesSummaryResponse> => {
  const now = new Date();

  const oneMonthAgo = subtractMonths(now, 1);
  const twoMonthsAgo = subtractMonths(now, 2);

  const [currentRecords, previousRecords] = await Promise.all([
    prisma.ordersSummary.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo,
          lt: now,
        },
      },
      select: {
        id: true,
        createdAt: true,
        totalPrice: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.ordersSummary.findMany({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
      select: {
        id: true,
        createdAt: true,
        totalPrice: true,
      },
    }),
  ]);

  // Calculate sales, transactions, and average.
  const calculateTotals = (records: typeof currentRecords): SalesTotals => {
    const totalSales = records.reduce(
      (sum, record) => sum + record.totalPrice,
      0
    );

    const totalTransactions = records.length;

    return {
      sales: totalSales,
      transaction: totalTransactions,
      average: totalTransactions > 0 ? totalSales / totalTransactions : 0,
    };
  };

  const currentTotals = calculateTotals(currentRecords);
  const previousTotals = calculateTotals(previousRecords);

  // Group current records by day.
  const dailyTotals = new Map<string, DailySales>();

  currentRecords.forEach((record) => {
    const dateKey = record.createdAt.toISOString().slice(0, 10);

    const existing = dailyTotals.get(dateKey);

    if (existing) {
      existing.totalPrice += record.totalPrice;
      existing.count += 1;
    } else {
      dailyTotals.set(dateKey, {
        createdAt: new Date(`${dateKey}T00:00:00.000Z`),
        totalPrice: record.totalPrice,
        count: 1,
      });
    }
  });

  const monthlyRecord: SalesRecord[] = Array.from(dailyTotals.values()).map(
    (record) => ({
      createdAt: record.createdAt,
      _sum: {
        totalPrice: record.totalPrice,
      },
      _count: {
        id: record.count,
      },
    })
  );

  return {
    monthlyRecord,
    total: currentTotals[method],
    totalBefore: previousTotals[method],
  };
};

// GET MONTHLY SALES
export const getBarService = async (): Promise<MonthlySales> => {
  const endDate = new Date();
  const startDate = subtractMonths(endDate, 6);

  const orders = await prisma.ordersSummary.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group sales by year and month.
  const monthlyTotals = orders.reduce<MonthlySales>((acc, order) => {
    const month = order.createdAt.toISOString().slice(0, 7);

    acc[month] = (acc[month] ?? 0) + order.totalPrice;

    return acc;
  }, {});

  return monthlyTotals;
};
