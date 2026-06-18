import db from "../../config/database/db.js";

const create_product = async (req, res) => {
    const {
        reference_title,
        base_percentage,
        fine_rules,
        min_loan_amount,
        max_loan_amount,
        max_term_days,
    } = req.body;
    try {
        if(!reference_title || !base_percentage || !fine_rules || !min_loan_amount || !max_loan_amount || !max_term_days) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newProduct = {
            reference_title,
            base_percentage,
            fine_rules,
            min_loan_amount,
            max_loan_amount,
            max_term_days,
        };
        const createdProduct = await db
            .select()
            .from("loan_products")
            .insert(newProduct)
            .returning("*");
        
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: createdProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const get_product = async (req, res) => {
     try {
        const { id } = req.params;
        const product = await db("loan_products").where({ id }).first();
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const get_all_products = async (req, res) => {
    try {
        const products = await db("loan_products").select();
        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const update_product = async (req, res) => {
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
        if(!reference_title || !base_percentage || !fine_rules || !min_loan_amount || !max_loan_amount || !max_term_days) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        await db("loan_products")
            .where({ id })
            .update({
                reference_title,
                base_percentage,
                fine_rules,
                min_loan_amount,
                max_loan_amount,
                max_term_days
            });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
const delete_product = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await db("loan_products").where({ id }).del();
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}