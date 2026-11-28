export interface Product {
  id: string
  name: string
  image: string
  category: string
  price: number
}

// CREATE ORDER INPUT
export interface CreateOrderItemInput {
  productName: string
  size: string
  temperature: string
  moddedPrice: number
}

export interface CreateOrderInput {
  paymentMethod: string
  totalPrice: number
  user: string
  createdAt?: string
  orders: CreateOrderItemInput[]
}

// ORDER ITEM RESPONSE
export interface OrderItemResponse {
  id: string
  productId: string
  size: string
  temperature: string
  moddedPrice: number
  productName: string
}

// ORDER SUMMARY RESPONSE
export interface OrderSummaryResponse {
  id: string
  paymentMethod: string
  userId: string
  username: string
  totalPrice: number
  createdAt: string
  orders: OrderItemResponse[]
}

// TOP PRODUCTS RESPONSE
export interface TopProductResponse {
  productId: string
  count: number
  productDetails: Product | null
}

// PRODUCT BREAKDOWN
export interface ProductBreakdownResponse {
  productId: string
  category: string | null
  count: number
  name: string | null
  image: string | null
}

// USER BREAKDOWN
export interface UserBreakdownResponse {
  userId: string
  username: string | null
  count: number
}

// PAYMENT METHOD BREAKDOWN
export interface PaymentMethodBreakdownResponse {
  paymentMethod: string
  count: number
}

// COMPLETE BREAKDOWN RESPONSE
export interface BreakdownResponse {
  productDetails: ProductBreakdownResponse[]
  userCounts: UserBreakdownResponse[]
  paymentMethodCounts: PaymentMethodBreakdownResponse[]
}

// CREATE ORDER RESPONSE
export interface CreateOrderResponse {
  id: string
  paymentMethod: string
  userId: string
  totalPrice: number
  createdAt: string
  user: {
    id: string
    username: string
  }
  orders: {
    id: string
    productId: string
    size: string
    temperature: string
    moddedPrice: number
    product: Product
  }[]
}
