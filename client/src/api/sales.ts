import caller from './caller'

import type {
  SalesMetric,
  SalesTotal,
  MonthlySales,
} from '../types/sales.types'

// GET SALES TOTALS
export const getTotal = async (method: SalesMetric): Promise<SalesTotal> => {
  return caller(`/sales/total?method=${encodeURIComponent(method)}`)
}

// GET MONTHLY SALES
export const getBar = async (): Promise<MonthlySales[]> => {
  return caller('/sales/bar')
}
