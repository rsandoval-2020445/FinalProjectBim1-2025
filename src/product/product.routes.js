import { Router } from "express"
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "./product.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"

const router = Router()

// Rutas públicas (no necesitan autenticación)
router.get("/", getAllProducts)    // Obtener todos los productos
router.get("/:id", getProductById) // Obtener un producto por ID

// Rutas protegidas (solo ADMIN)
router.post("/create", validateJwt, isAdmin, createProduct) // Crear producto
router.put("/:id", validateJwt, isAdmin, updateProduct)     // Actualizar producto
router.delete("/:id", validateJwt, isAdmin, deleteProduct)  // Eliminar producto

export default router
