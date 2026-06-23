import { db } from "../../config/database/db.js";
import { loan_products } from "../../config/database/schemas/loan_products.js";
import { eq } from "drizzle-orm";
import sampleProduct from "../../../store/loan.Product.js";

export const create_product = async (req, res) => {
  const {
    tenant_id, // Mandatory in your schema
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
      .insert(loan_products)
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
      .from(loan_products)
      .where(eq(loan_products.id, id));

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

export const get_all_products = async (req, res) => {
  try {
    const products = await db.select().from(loan_products);
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
  const { id } = req.params;
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
      .update(loan_products)
      .set({
        reference_title,
        base_percentage,
        fine_rules,
        min_loan_amount,
        max_loan_amount,
        max_term_days,
      })
      .where(eq(loan_products.id, id));

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const delete_product = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db
      .delete(loan_products)
      .where(eq(loan_products.id, id))
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
