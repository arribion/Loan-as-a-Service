import db from "../../config/database/db.js";
import { loanProducts } from "../../config/database/schemas/index.js";
import { and, eq } from "drizzle-orm";
import sampleProduct from "../../../store/loan.Product.js";

export const create_product = async (req, res) => {
  const { tenant_id } = req.params;
  const {
    reference_title,
    interest_calculation_type,
    base_percentage,
    fine_rules,
    min_loan_amount,
    max_loan_amount,
    max_term_days,
  } = req.body;

  try {
    if (
      !tenant_id ||
      !reference_title ||
      !base_percentage ||
      !fine_rules ||
      !min_loan_amount ||
      !max_loan_amount ||
      !max_term_days
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including tenant_id",
      });
    }

    const newProduct = {
      tenant_id,
      reference_title,
      interest_calculation_type: interest_calculation_type || "flat",
      base_percentage,
      fine_rules,
      min_loan_amount,
      max_loan_amount,
      max_term_days,
    };
    const createdProduct = await db
      .insert(loanProducts)
      .values(newProduct)
      .returning();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct[0],
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const get_product = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db
      .select()
      .from(loanProducts)
      .where(eq(loanProducts.id, id));

    const product = results[0];

    if (!product) {

      if (!sampleProduct || sampleProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Sample product not found",
        });
      } else {
        const sample_product = sampleProduct.map((prod) => ({
          id: prod.id,
          reference_title: prod.reference_title,
          interest_calculation_type: prod.interest_calculation_type,
          base_percentage: prod.base_percentage,
          fine_rules: prod.fine_rules,
          min_loan_amount: prod.min_loan_amount,
          max_loan_amount: prod.max_loan_amount,
          max_term_days: prod.max_term_days,
        }));
        return res.status(404).json(sample_product);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL PRODUCTS
export const get_all_products = async (req, res) => {
  const { tenant_id } = req.params;
  try {
    const products = await db
      .select()
      .from(loanProducts)
      .where(eq(loanProducts.tenant_id, tenant_id));
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const update_product = async (req, res) => {
  const { id, tenant_id } = req.params;
  const {
    reference_title,
    base_percentage,
    fine_rules,
    min_loan_amount,
    max_loan_amount,
    max_term_days,
  } = req.body;

  try {
    if (
      !reference_title ||
      !base_percentage ||
      !fine_rules ||
      !min_loan_amount ||
      !max_loan_amount ||
      !max_term_days
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    await db
      .update(loanProducts)
      .set({
        reference_title,
        base_percentage,
        fine_rules,
        min_loan_amount,
        max_loan_amount,
        max_term_days,
      })
      .where(and(
        eq(loanProducts.id, id),
        eq(loanProducts.tenant_id, tenant_id),
      ));

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Database Error Context:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// delete a product
export const delete_product = async (req, res) => {
  const { id, tenant_id } = req.params;
  try {
    const deleted = await db
      .delete(loanProducts)
      .where(and(
        eq(loanProducts.id, id),
        eq(loanProducts.tenant_id, tenant_id),
      ))
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default {
  create_product,
  update_product,
  delete_product,
  get_all_products,
  get_product,
};
