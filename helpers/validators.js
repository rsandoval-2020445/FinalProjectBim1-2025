// Propósito: Validar los datos de entrada de las rutas
import { body } from "express-validator"
import { validateErrors } from "./validate.error.js"
import { existUsername, ObjectIdValid } from "./db.validator.js"
import Category from "../src/category/category.model.js"

// Validar que el nombre de la categoría sea único
export const categoryValidation = [
  body('name', 'El nombre de la categoría es obligatorio').notEmpty(),
  body('name').custom(async (value) => {
    const category = await Category.findOne({ name: value })
    if (category) {
      throw new Error('La categoría ya existe')
    }
  }),
  validateErrors
]

// Validar la información del carrito
export const cartValidation = [
  body('userId', 'El ID de usuario es obligatorio').notEmpty().custom(ObjectIdValid),
  body('productId', 'El ID del producto es obligatorio').notEmpty().custom(ObjectIdValid),
  body('quantity', 'La cantidad debe ser mayor que 0').isInt({ min: 1 }),
  validateErrors
]

// Validación para el registro de usuario
export const registerValidator = [
  body('name', 'El nombre no puede estar vacío').notEmpty(),
  body('surname', 'El apellido es obligatorio').notEmpty(),
  body('email', 'El email no puede estar vacío o no es válido').notEmpty().isEmail(),
  body('username', 'El nombre de usuario no puede estar vacío').notEmpty().toLowerCase().custom(existUsername),
  body('password', 'La contraseña debe ser fuerte y tener al menos 8 caracteres').notEmpty().isStrongPassword().isLength({ min: 8 }),
  body('phone', 'El teléfono no puede estar vacío').notEmpty().isMobilePhone(),
  validateErrors
]

// Validación para login
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

// Validar la información del producto
export const productValidation = [
  body('name', 'El nombre del producto no puede estar vacío').notEmpty(),
  body('price', 'El precio debe ser un número positivo').notEmpty().isFloat({ gt: 0 }),
  body('stock', 'El stock debe ser un número entero no negativo').notEmpty().isInt({ min: 0 }),
  body('category', 'La categoría debe ser un ObjectId válido').optional().custom(ObjectIdValid), // Asegúrate de usar 'optional' para la validación de categoría
  validateErrors
]

// Validar la información de la factura
export const invoiceValidation = [
  body('user', 'El ID del usuario es obligatorio').notEmpty().custom(ObjectIdValid),
  body('products', 'El array de productos no puede estar vacío').notEmpty().isArray(),
  body('totalAmount', 'El monto total debe ser un número positivo').notEmpty().isFloat({ gt: 0 }),
  validateErrors
]
