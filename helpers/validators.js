import { body } from "express-validator";
import { validateErrors } from "./validate.error.js";
import { existUsername, ObjectIdValid } from "./db.validator.js";

export const registerValidator = [
    body('name', 'Name cannot be empty')
    .notEmpty(),
    body('surname', 'Surname is required')
    .notEmpty(),
    body('email', 'Email cannot be empty or is not valid')
    .notEmpty()
    .isEmail(),
    body('username', 'Username cannot be empty')
    .notEmpty()
    .toLowerCase()
    .custom(existUsername),
    body('password', 'Password must be strong and at least 8 characters long')
    .notEmpty()
    .isStrongPassword()
    .isLength({ min: 8 }),
    body('phone', 'Phone cannot be empty')
    .notEmpty()
     .isMobilePhone(),
    validateErrors
]

export const loginValidator = [
    body('username', 'Username cannot be empty')
    .notEmpty()
    .toLowerCase(),
    body('password', 'Password must be strong and at least 8 characters long')
    .notEmpty()
    .isStrongPassword()
    .isLength({ min: 8 }),
    validateErrors
]

export const productValidation = [
    body('name', 'Product name cannot be empty')
    .notEmpty(),
    body('price', 'Price must be a positive number')
    .notEmpty()
    .isFloat({ gt: 0 }),
    body('stock', 'Stock must be a non-negative integer')
    .notEmpty()
    .isInt({ min: 0 }),
    body('category', 'Category must be a valid ObjectId')
    .notEmpty()
    .custom(ObjectIdValid),
    validateErrors
]

export const invoiceValidation = [
    body('user', 'User ID is required')
    .notEmpty()
    .custom(ObjectIdValid),
    body('products', 'Products array cannot be empty')
    .notEmpty()
    .isArray(),
    body('totalAmount', 'Total amount must be a positive number')
    .notEmpty()
    .isFloat({ gt: 0 }),
    validateErrors
]