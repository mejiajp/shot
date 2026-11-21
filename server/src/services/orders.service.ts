import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { CreateOrderInput } from "../types/orders.types";

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
export const getTopProducts = async () => {
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

  const productMap = Object.fromEntries(
    products.map((product) => [product.id, product])
  );

  const orderedProducts = total.map((item) => ({
    productId: item.productId,
    count: item._count.id,
    productDetails: productMap[item.productId],
  }));

  return orderedProducts;
};

// TOP PRODUCTS WEEK
export const getTopProductsWeek = async () => {
  const lastMonth = new Date();

  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const orderSummariesLastWeek = await prisma.ordersSummary.findMany({
    where: {
      createdAt: {
        gte: lastMonth,
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

  const productMap = Object.fromEntries(
    products.map((product) => [product.id, product])
  );

  const orderedProducts = total.map((item) => ({
    productId: item.productId,
    count: item._count.id,
    productDetails: productMap[item.productId],
  }));

  return orderedProducts;
};

// BREAKDOWN
export const getBreakdown = async () => {
  // Group orders by productId and count them
  const orderCountsByProduct = await prisma.order.groupBy({
    by: ["productId"],
    _count: {
      productId: true,
    },
  });

  // Sort product counts in descending order
  const sortedOrderCountsByProduct = orderCountsByProduct.sort(
    (a, b) => b._count.productId - a._count.productId
  );

  // Group by userId in the orderSummary table and count, including usernames
  const userCounts = await prisma.ordersSummary.groupBy({
    by: ["userId"],
    _count: {
      userId: true,
    },
  });

  // Fetch usernames for each userId
  const userWithNames = await Promise.all(
    userCounts.map(async (user) => {
      const userDetails = await prisma.user.findUnique({
        where: {
          id: user.userId,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return {
        userId: user.userId,
        username: userDetails?.username,
        count: user._count.userId,
      };
    })
  );

  // Sort user counts by count in descending order
  const sortedUserCounts = userWithNames.sort((a, b) => b.count - a.count);

  // Group by paymentMethod in the orderSummary table and count
  const paymentMethodCounts = await prisma.ordersSummary.groupBy({
    by: ["paymentMethod"],
    _count: {
      paymentMethod: true,
    },
  });

  // Sort payment method counts in descending order
  const sortedPaymentMethodCounts = paymentMethodCounts.sort(
    (a, b) => b._count.paymentMethod - a._count.paymentMethod
  );

  // Fetch product details (like category) for each productId
  const productDetails = await Promise.all(
    sortedOrderCountsByProduct.map(async (order) => {
      const product = await prisma.product.findUnique({
        where: {
          id: order.productId,
        },
        select: {
          id: true,
          name: true,
          image: true,
          category: true,
        },
      });

      return {
        productId: order.productId,
        category: product?.category,
        count: order._count.productId,
        name: product?.name,
        image: product?.image,
      };
    })
  );

  // Combine the product breakdown with the separate user and payment method counts
  return {
    productDetails,
    userCounts: sortedUserCounts,
    paymentMethodCounts: sortedPaymentMethodCounts.map((method) => ({
      paymentMethod: method.paymentMethod,
      count: method._count.paymentMethod,
    })),
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
