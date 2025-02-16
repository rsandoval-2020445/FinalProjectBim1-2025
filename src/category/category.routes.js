import { Router } from "express"
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "./category.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post(
    "/create", 
    [validateJwt], 
    createCategory
)

api.get(
    "/", 
    getAllCategories
)

api.get(
    "/:id", 
    getCategoryById
)

api.put(
    "/:id", 
    [validateJwt], 
    updateCategory
)

api.delete(
    "/:id", 
    [validateJwt], 
    deleteCategory
)

export default api
