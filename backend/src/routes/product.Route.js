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

/**params
 * 
 * 
 * 
 */

// Define the routes
productRouter
  .post("/:tenant_id/create", create_product)
  .get("/:tenant_id/", get_all_products)
  .get("/:tenant_id/get/:id", get_product)
  .put("/:tenant_id/update/:id", update_product)
  .delete("/:tenant_id/delete/:id", delete_product);

export default productRouter;