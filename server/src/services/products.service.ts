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
  const topProducts = await prisma.order.groupBy({
    by: ["productId"],
    _sum: {
      moddedPrice: true,
    },
    orderBy: {
      _sum: {
        moddedPrice: "desc",
      },
    },
    take: 3,
  });

  const products = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      return product;
    })
  );

  return products.filter((product) => product !== null);
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
      id,
    },
  });

  return deletedProduct;
};

interface UpdateProductParams {
  id: string;
  name: string;
  category: string;
  price: string | number;
  image: string;
}

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
  const parsedPrice = Number(price);

  if (!name.trim() || !category.trim()) {
    throw new Error("Product name and category are required.");
  }

  if (!Number.isSafeInteger(parsedPrice) || parsedPrice < 0) {
    throw new Error("Invalid product price.");
  }

  const titleCaseName = name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return prisma.product.update({
    where: { id },
    data: {
      name: titleCaseName,
      category: category.trim(),
      price: parsedPrice,
      image,
    },
  });
};
