import { Router } from "express"
import { registerUser, loginUser } from "./auth.controller.js"

const api = Router()

api.post("/register", registerUser)
api.post("/login", loginUser)

export default api
