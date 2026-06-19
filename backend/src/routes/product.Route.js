import express from "express";
const productRouter = express.Router();

// product controller
import {
  create_product,
  update_product,
  delete_product,
  get_all_products,
  get_product,
} from "../controllers/tenant/product.Controller.js";

// Define the routes
productRouter
    .get("/", get_all_products)
    .get("/:id", get_product)
    .post("/", create_product)
    .put("/:id", update_product)
    .delete("/:id", delete_product);

export default productRouter;