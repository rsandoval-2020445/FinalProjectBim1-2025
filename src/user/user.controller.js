import User from "./user.model.js"
import mongoose from "mongoose"
import { encrypt, checkPassword } from "../../utils/encrypt.js"

// Obtener todos los usuarios (público)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users", error: err.message })
  }
}

// Obtener usuario por ID (público)
export const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err.message })
  }
}

// Actualizar usuario (ADMIN solo clientes y a sí mismo, CLIENT solo a sí mismo, sin password)
export const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (req.body.password) {
      return res.status(400).json({ message: "Use the change password function" })
    }

    if (req.user.role === "ADMIN" && user.role === "ADMIN" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Admins cannot update other admins" })
    }

    if (req.user.role === "ADMIN" && user.role !== "CLIENT" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Admins can only update clients or themselves" })
    }

    if (req.user.role === "CLIENT" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Clients can only update themselves" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, select: "-password" })
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message })
  }
}

// Actualizar contraseña (Cliente solo a sí mismo, ADMIN no puede cambiar contraseñas de otros)
export const updatePassword = async (req, res) => {
  try {
    if (req.user.role === "ADMIN" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Admins cannot change other users' passwords" })
    }

    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // Usar checkPassword de Argon2 en lugar de bcrypt.compare()
    const isMatch = await checkPassword(user.password, oldPassword)
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" })

    // Encriptar la nueva contraseña con encrypt (Argon2)
    user.password = await encrypt(newPassword)
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err.message })
  }
}

// Eliminar usuario (ADMIN solo clientes y a sí mismo, CLIENT solo a sí mismo)
export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (req.user.role === "ADMIN" && user.role === "ADMIN" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Admins cannot delete other admins" })
    }

    if (req.user.role === "ADMIN" && user.role !== "CLIENT" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Admins can only delete clients or themselves" })
    }

    if (req.user.role === "CLIENT" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Clients can only delete themselves" })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message })
  }
}
