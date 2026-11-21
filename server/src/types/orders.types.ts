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
