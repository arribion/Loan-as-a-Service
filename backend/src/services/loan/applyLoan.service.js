import getLoanProduct from "./pull.loan.product.js";
import db from "../../config/database/db.js";
import { loans } from "../../config/database/schemas/index.js/loans.js";

export const applyLoan = async (req, res) => {
  const { productID } = req.params;
  const { principal, termDays } = req.body;

  // Mock borrower ID from authentication middleware (replace with req.user.id in production)
  const borrowerId = req.user?.id || "bc5e8a5b-9d41-4c6e-82fb-b09bb68d37aa";

  try {
    // 1. Validate basic input
    if (
      !productID ||
      !principal ||
      principal <= 0 ||
      !termDays ||
      termDays <= 0
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid parameters. Principal and term days are required.",
        });
    }

    // 2. Pull the specific loan product details
    const productsArray = await getLoanProduct(productID);
    const product = productsArray[0]; // Get the object out of the query array

    if (!product) {
      return res.status(404).json({ message: "Loan product not found" });
    }

    // 3. Validate principal against product limits
    const amount = parseFloat(principal);
    const minAmount = parseFloat(product.min_loan_amount);
    const maxAmount = parseFloat(product.max_loan_amount);

    if (amount < minAmount || amount > maxAmount) {
      return res.status(400).json({
        message: `Amount must be between ${minAmount} and ${maxAmount} for a ${product.reference_title}`,
      });
    }

    // 4. Validate requested term days against maximum configuration
    if (parseInt(termDays) > product.max_term_days) {
      return res.status(400).json({
        message: `The maximum days allowed for this loan is ${product.max_term_days} days.`,
      });
    }

    // 5. Calculate starting balance (matches principal initially)
    const databaseAmountStr = amount.toFixed(2);

    // 6. Execute database insertion
    const [newLoan] = await db
      .insert(loans)
      .values({
        tenant_id: product.tenant_id,
        borrower_id: borrowerId,
        product_id: product.id,
        principal_amount: databaseAmountStr,
        balance_outstanding: databaseAmountStr,
        term_days: parseInt(termDays),
        status: "pending_approval",
      })
      .returning();

    // 7. Send successful payload response
    return res.status(201).json({
      message: `${product.reference_title} application submitted successfully`,
      loan: newLoan,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error applying for loan", error: error.message });
  }
};
