import express_validator from "express-validator";

const { body, validationResult } = express_validator;

const registration_validator = [
    body("email").isEmail().withMessage("invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "validation errors",
                errors: errors.array()
            });
        }
        next();
    }
];

const login_validator = [
    body("email").isEmail().withMessage("invalid email format"),
    body("password").notEmpty().withMessage("password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "validation errors",
                errors: errors.array()
            });
        }
        next();
    }
];

export {
    registration_validator,
    login_validator
};