import { Router } from 'express'
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getOutOfStockProducts,   
  getTopSellingProduct     
} from './product.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const router = Router()

//productos más vendidos y productos fuera de stock
router.get('/top-selling', getTopSellingProduct)  
router.get('/outofstock', getOutOfStockProducts) 

// Rutas públicas (no necesitan autenticación)
router.get('/', getAllProducts)  
router.get('/:id', getProductById)  

// Rutas protegidas (solo ADMIN)
router.post('/create', validateJwt, isAdmin, createProduct)  
router.put('/:id', validateJwt, isAdmin, updateProduct) 
router.delete('/:id', validateJwt, isAdmin, deleteProduct) 


export default router
