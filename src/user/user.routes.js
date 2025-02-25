import { Router } from "express"
import { getAllUsers, getUserById, updateUser, updatePassword, deleteUser } from "./user.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"


const api = Router()

api.get("/", getAllUsers)


api.get(
    "/:id", 
    validateJwt, 
    getUserById
)

api.put(
    "/:id", 
    validateJwt, 
    updateUser
)

api.put(
    "/:id/password", 
    validateJwt, 
    updatePassword
)

api.delete(
    "/:id", 
    validateJwt, 
    deleteUser
)


export default api
