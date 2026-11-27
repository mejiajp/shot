export type SalesMetric = 'sales' | 'transaction' | 'average'

export interface SalesTotal {
  total: number
}

export interface MonthlySales {
  month: string
  total: number
}
