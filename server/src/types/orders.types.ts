import type { Product } from "@prisma/client";

export interface CreateOrderItemInput {
  productName: string;
  size: string;
  temperature: string;
  moddedPrice: number;
}

export interface CreateOrderInput {
  paymentMethod: string;
  totalPrice: number;
  user: string;
  createdAt?: Date | string;
  orders: CreateOrderItemInput[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  size: string;
  temperature: string;
  moddedPrice: number;
  productName: string;
}

export interface OrderSummaryResponse {
  id: string;
  paymentMethod: string;
  userId: string;
  username: string;
  totalPrice: number;
  createdAt: Date;
  orders: OrderItemResponse[];
}

// TOP PRODUCTS
export interface TopProductResponse {
  productId: string;
  count: number;
  productDetails: Product | null;
}

// PRODUCT BREAKDOWN
export interface ProductBreakdownResponse {
  productId: string;
  category: Product["category"] | null;
  count: number;
  name: string | null;
  image: Product["image"] | null;
}

// USER BREAKDOWN
export interface UserBreakdownResponse {
  userId: string;
  username: string | null;
  count: number;
}

// PAYMENT METHOD BREAKDOWN
export interface PaymentMethodBreakdownResponse {
  paymentMethod: string;
  count: number;
}

// COMPLETE BREAKDOWN
export interface BreakdownResponse {
  productDetails: ProductBreakdownResponse[];
  userCounts: UserBreakdownResponse[];
  paymentMethodCounts: PaymentMethodBreakdownResponse[];
}
