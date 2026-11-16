import { Request, Response } from "express";
import {
  getTopProductsService,
  getProductsService,
  createProductService,
  deleteProductService,
  updateProductService,
} from "../services/products.service";

// top products
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const selected = await getTopProductsService();

    res.json(selected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
};

// all
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductsService();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, category, price, image } = req.body;

  try {
    const result = await createProductService({
      name,
      category,
      price,
      image,
    });

    if (result.imageSaved) {
      console.log("Image saved as:", result.imageName);
    }

    return res.status(200).json({
      message: "Product created successfully",
      newProduct: result.newProduct,
    });
  } catch (error: any) {
    if (error.type === "CREATE_PRODUCT_ERROR") {
      console.error("Error creating product:", error);
      return res.status(500).json({ error: "Failed to create product." });
    }

    console.error("Error saving image:", error);
    res.status(500).json({ error: "Failed to save product or image." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log("API delete");

  try {
    const deletedProduct = await deleteProductService(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// PUT route to update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, price, image } = req.body;

  console.log("API edit");

  try {
    const updatedProduct = await updateProductService({
      id,
      name,
      category,
      price,
      image,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
  }
};
