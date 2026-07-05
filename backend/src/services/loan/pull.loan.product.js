import { db } from "../../config/database/db.js";
import { loan_products } from "../../config/database/schemas/loan_products.js";
import { eq } from "drizzle-orm"; // Added this import

export const getLoanProduct = async (productID) => {
  // Removed req/res to make it a reusable service function
  try {
    const loanProducts = await db
      .select()
      .from(loan_products)
      .where(eq(loan_products.productID, productID)); // Removed .returning() as it is only for INSERT/UPDATE/DELETE

    return loanProducts[0] || null; // Return the specific product or null if not found
  } catch (error) {
    throw new Error("Error retrieving loan products: " + error.message);
  }
};

export default getLoanProduct;
