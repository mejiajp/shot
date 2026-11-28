import caller from './caller'

import type {
  OrderSummaryResponse,
  TopProductResponse,
  BreakdownResponse,
  CreateOrderInput,
  CreateOrderResponse,
} from '../types/order.types'

// GET ALL ORDERS
export const getAllOrders = async (): Promise<OrderSummaryResponse[]> => {
  return caller('/orders')
}

// GET TOP PRODUCTS
export const getTopProducts = async (): Promise<TopProductResponse[]> => {
  return caller('/orders/top-products')
}

// GET TOP PRODUCTS (LAST 7 DAYS)
export const getTopProductsWeek = async (): Promise<TopProductResponse[]> => {
  return caller('/orders/top-products-week')
}

// GET BREAKDOWN
export const getBreakdown = async (): Promise<BreakdownResponse> => {
  return caller('/orders/breakdown')
}

// CREATE ORDER
export const createOrder = async (
  order: CreateOrderInput
): Promise<CreateOrderResponse> => {
  return caller('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  })
}
