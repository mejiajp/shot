import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

import saveProductImage from "../lib/saveProductImage";
import formatProductName from "../lib/formatProductName";
import parseProductPrice from "../lib/parseProductPrice";

const prisma = new PrismaClient();

// centralized image dir
const IMAGE_DIRECTORY = path.resolve(__dirname, "../../assets/menu");

// top products
export const getTopProductsService = async () => {
  const total = await prisma.order.groupBy({
    by: ["productId"],
    _sum: {
      moddedPrice: true,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _sum: {
        moddedPrice: "desc",
      },
    },
    take: 3,
  });

  const selected = await prisma.product.findMany({
    where: {
      id: { in: total.map((item) => item.productId) },
    },
  });

  return selected;
};

// all
export const getProductsService = async () => {
  const products = await prisma.product.findMany({});

  return products;
};

interface CreateProductParams {
  name: string;
  category: string;
  price: string | number;
  image: string;
}

export const createProductService = async ({
  name,
  category,
  price,
  image,
}: CreateProductParams) => {
  const formattedName = formatProductName(name);
  const parsedPrice = parseProductPrice(price);

  let imageName: string | undefined;

  try {
    // REVISED: Uses extracted image helper
    imageName = await saveProductImage(image, formattedName);

    const newProduct = await prisma.product.create({
      data: {
        name: formattedName,
        category,
        price: parsedPrice,
        image: `../assets/menu/${imageName}`,
      },
    });

    return {
      newProduct,
      imageName,
      imageSaved: true,
    };
  } catch (error) {
    // NEW: Remove image if database creation fails
    if (imageName) {
      await fs.unlink(path.join(IMAGE_DIRECTORY, imageName)).catch(() => {});
    }

    throw error;
  }
};

export const deleteProductService = async (id: string) => {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: id,
    },
  });

  const all = await prisma.product.findMany({});

  console.log(all);

  return deletedProduct;
};

interface UpdateProductParams {
  id: string;
  name: string;
  category: string;
  price: string | number;
  image: string;
}

export const updateProductService = async ({
  id,
  name,
  category,
  price,
  image,
}: UpdateProductParams) => {
  const parsedPrice = parseInt(price.toString(), 10);

  // Update the product in the database
  const updatedProduct = await prisma.product.update({
    where: { id: id },
    data: {
      name,
      category,
      price: parsedPrice,
      image,
    },
  });

  const all = await prisma.product.findMany({});

  console.log(all);

  return updatedProduct;
};
