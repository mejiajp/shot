export type SalesMetric = "sales" | "transaction" | "average";

export interface SalesTotals {
  sales: number;
  transaction: number;
  average: number;
}

export interface DailySales {
  createdAt: Date;
  totalPrice: number;
  count: number;
}

export interface SalesRecord {
  createdAt: Date;
  _sum: {
    totalPrice: number;
  };
  _count: {
    id: number;
  };
}

export interface SalesSummaryResponse {
  monthlyRecord: SalesRecord[];
  total: number;
  totalBefore: number;
}

export interface MonthlySales {
  [month: string]: number;
}
