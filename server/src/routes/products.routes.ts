import express from "express";
import {
  getTopProducts,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller";

const router = express.Router();

router.get("/top", getTopProducts);
router.get("/", getProducts);
router.post("/create", createProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);

export default router;
