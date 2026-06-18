import express from "express";
const productRouter = express.Router();

// Import the product controller
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.Controller.js";

// Define the routes
productRouter
    .get("/", getAllProducts)
    .get("/:id", getProductById)
    .post("/", createProduct)
    .put("/:id", updateProduct)
    .delete("/:id", deleteProduct);

export default productRouter;