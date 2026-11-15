import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

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
  onImageError: (err: Error) => void;
}

export const createProductService = async ({
  name,
  category,
  price,
  image,
  onImageError,
}: CreateProductParams) => {
  try {
    const titleCaseName = name
      .toLowerCase()
      .replace(/(?:^|\s)(\w)/g, (match: String) => match.toUpperCase()) // Capitalize the first letter of each word
      .replace(/\s+/g, ""); // Remove spaces completely

    // Extract the file extension from the Base64 string
    const extension = image.substring(
      "data:image/".length,
      image.indexOf(";base64")
    );

    const parsedPrice = parseInt(price.toString(), 10);

    // Form the final image name in Title Case format with extension
    const imageName = `${titleCaseName}.${extension}`;

    // Define the save path
    const savePath = path.join(__dirname, "../../assets/menu", imageName);

    // Remove base64 prefix to get the actual data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 string to a buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Save the image file
    let imageSaved = false;

    fs.writeFile(savePath, imageBuffer, (err) => {
      if (err) {
        onImageError(err);
        return;
      }

      imageSaved = true;
      console.log("Image saved as:", imageName);
    });

    try {
      const newProduct = await prisma.product.create({
        data: {
          name: titleCaseName, // Using title case for the name
          price: parsedPrice, // Save the price as an integer
          category: category,
          image: `../assets/menu/${imageName}`,
        },
      });

      return {
        newProduct,
        imageName,
        imageSaved,
      };
    } catch (error: any) {
      error.type = "CREATE_PRODUCT_ERROR";
      throw error;
    }
  } catch (error) {
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
