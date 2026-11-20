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
