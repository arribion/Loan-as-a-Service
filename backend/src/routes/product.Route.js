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
    .post("/", create_product)
    .get("/:id", get_product)
    .get("/", get_all_products)
    .put("/:id", update_product)
    .delete("/:id", delete_product);

export default productRouter;