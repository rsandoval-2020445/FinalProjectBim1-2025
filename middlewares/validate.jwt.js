import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import User from "../src/user/user.model.js"

export const validateJwt = async (req, res, next) => {
  try {
    const secretKey = process.env.SECRET_KEY
    if (!secretKey) {
      console.error("SECRET_KEY is missing.")
      return res.status(500).send({ message: "Internal server error" })
    }

    const token = req.headers["x-access-token"] || req.headers["authorization"]
    console.log("Token recibido en validateJwt:", token)
    
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: Token missing" })
    }

    let decoded
    try {
      decoded = jwt.verify(token, secretKey)
    } catch (err) {
      console.error("JWT verification error:", err.message)
      return res.status(401).send({ message: "Invalid or expired token" })
    }

    // Verificar si el token contiene un ID válido
    const userId = decoded._id || decoded.userId

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error("El ID del usuario en el token es inválido:", userId)
      return res.status(400).send({ message: "Invalid token: User ID is not valid" })
    }

    // Buscar al usuario en la base de datos
    const user = await User.findById(new mongoose.Types.ObjectId(userId))

    if (!user) {
      console.error("Usuario no encontrado en la base de datos:", userId)
      return res.status(404).send({ message: "User not found" })
    }

    // Inyectar usuario en `req.user`
    req.user = user
    console.log("Usuario autenticado correctamente:", req.user)
    next()
  } catch (err) {
    console.error("Error inesperado en validateJwt:", err)
    return res.status(500).send({ message: "Internal server error", error: err.message })
  }
}

// Middleware para validar si el usuario es ADMIN
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).send({
        success: false,
        message: `You don't have access | username ${req.user?.username || "Unknown"}`
      })
    }
    next()
  } catch (err) {
    console.error("Error in isAdmin middleware:", err)
    return res.status(403).send({
      success: false,
      message: "Unauthorized role"
    })
  }
}
