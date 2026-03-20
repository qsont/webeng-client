import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
