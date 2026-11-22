import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { CreateOrderInput, OrderSummaryResponse } from "../types/orders.types";

const prisma = new PrismaClient();

// GET ALL ORDERS
export const getAllOrders = async (): Promise<OrderSummaryResponse[]> => {
  const ordersSummaries = await prisma.ordersSummary.findMany({
    include: {
      orders: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  const ordersData: OrderSummaryResponse[] = ordersSummaries.map((summary) => ({
    id: summary.id,
    paymentMethod: summary.paymentMethod,
    userId: summary.userId,
    username: summary.user.username,
    totalPrice: summary.totalPrice,
    createdAt: summary.createdAt,

    orders: summary.orders.map((order) => ({
      id: order.id,
      productId: order.productId,
      size: order.size,
      temperature: order.temperature,
      moddedPrice: order.moddedPrice,
      productName: order.product.name,
    })),
  }));

  return ordersData;
};

// TOP PRODUCTS

import type {
  BreakdownResponse,
  PaymentMethodBreakdownResponse,
  ProductBreakdownResponse,
  TopProductResponse,
  UserBreakdownResponse,
} from "../types/orders.types";

// TOP PRODUCTS
export const getTopProducts = async (): Promise<TopProductResponse[]> => {
  const total = await prisma.order.groupBy({
    by: ["productId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 3,
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: total.map((item) => item.productId),
      },
    },
  });

  // Create a lookup map for products
  const productMap = new Map(products.map((product) => [product.id, product]));

  // Combine product details with order counts
  const orderedProducts: TopProductResponse[] = total.map((item) => ({
    productId: item.productId,
    count: item._count.id,
    productDetails: productMap.get(item.productId) ?? null,
  }));

  return orderedProducts;
};

// TOP PRODUCTS WEEK
export const getTopProductsWeek = async (): Promise<TopProductResponse[]> => {
  const lastWeek = new Date();

  lastWeek.setDate(lastWeek.getDate() - 7);

  // Get order summaries from the last 7 days
  const orderSummariesLastWeek = await prisma.ordersSummary.findMany({
    where: {
      createdAt: {
        gte: lastWeek,
      },
    },
    select: {
      id: true,
    },
  });

  const orderSummaryIds = orderSummariesLastWeek.map((summary) => summary.id);

  const total = await prisma.order.groupBy({
    by: ["productId"],
    _count: {
      id: true,
    },
    where: {
      ordersSummaryId: {
        in: orderSummaryIds,
      },
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 3,
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: total.map((item) => item.productId),
      },
    },
  });

  // Create a lookup map for products
  const productMap = new Map(products.map((product) => [product.id, product]));

  // Combine product details with weekly order counts
  const orderedProducts: TopProductResponse[] = total.map((item) => ({
    productId: item.productId,
    count: item._count.id,
    productDetails: productMap.get(item.productId) ?? null,
  }));

  return orderedProducts;
};

// BREAKDOWN
export const getBreakdown = async (): Promise<BreakdownResponse> => {
  // Group orders by product and count them
  const orderCountsByProduct = await prisma.order.groupBy({
    by: ["productId"],
    _count: {
      productId: true,
    },
  });

  // Fetch all corresponding product details in one query
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: orderCountsByProduct.map((order) => order.productId),
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      category: true,
    },
  });

  // Create a lookup map for products
  const productMap = new Map(products.map((product) => [product.id, product]));

  // Combine product details with order counts
  const productDetails: ProductBreakdownResponse[] = orderCountsByProduct
    .map((order) => {
      const product = productMap.get(order.productId);

      return {
        productId: order.productId,
        category: product?.category ?? null,
        count: order._count.productId,
        name: product?.name ?? null,
        image: product?.image ?? null,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Group order summaries by user and count them
  const userCounts = await prisma.ordersSummary.groupBy({
    by: ["userId"],
    _count: {
      userId: true,
    },
  });

  // Fetch all corresponding usernames in one query
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userCounts.map((user) => user.userId),
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  // Create a lookup map for users
  const userMap = new Map(users.map((user) => [user.id, user.username]));

  // Combine usernames with user counts
  const sortedUserCounts: UserBreakdownResponse[] = userCounts
    .map((user) => ({
      userId: user.userId,
      username: userMap.get(user.userId) ?? null,
      count: user._count.userId,
    }))
    .sort((a, b) => b.count - a.count);

  // Group order summaries by payment method and count them
  const paymentMethodCounts = await prisma.ordersSummary.groupBy({
    by: ["paymentMethod"],
    _count: {
      paymentMethod: true,
    },
  });

  // Sort payment method counts in descending order
  const sortedPaymentMethodCounts: PaymentMethodBreakdownResponse[] =
    paymentMethodCounts
      .map((method) => ({
        paymentMethod: method.paymentMethod,
        count: method._count.paymentMethod,
      }))
      .sort((a, b) => b.count - a.count);

  // Return combined breakdown
  return {
    productDetails,
    userCounts: sortedUserCounts,
    paymentMethodCounts: sortedPaymentMethodCounts,
  };
};

// CREATE ORDER
export const createOrder = async (body: CreateOrderInput) => {
  const { paymentMethod, totalPrice, user, createdAt, orders } = body;

  const createOrderSummary = await prisma.ordersSummary.create({
    data: {
      paymentMethod,
      totalPrice,

      ...(createdAt && {
        createdAt: new Date(createdAt),
      }),

      // Connect user using unique username
      user: {
        connect: {
          username: user,
        },
      },

      // Create orders and connect their respective products
      orders: {
        create: orders.map((order) => ({
          size: order.size,
          temperature: order.temperature,
          moddedPrice: order.moddedPrice,

          product: {
            connect: {
              name: order.productName,
            },
          },
        })),
      },
    },

    include: {
      orders: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  console.log("Order Summary:", createOrderSummary);

  return createOrderSummary;
};
