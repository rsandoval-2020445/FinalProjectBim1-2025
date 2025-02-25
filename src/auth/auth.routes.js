import { Router } from "express"
import { registerUser, loginUser } from "./auth.controller.js"
import { registerValidator, loginValidator } from "../../helpers/validators.js"

const api = Router()

api.post("/register", registerValidator, registerUser)
api.post("/login", loginValidator, loginUser)

export default api
