import User from "../user/user.model.js"
import { encrypt, checkPassword } from "../../utils/encrypt.js"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, role, status } = req.body
        const hashedPassword = await encrypt(password)
        const newUser = new User(
            { 
                name, 
                surname, 
                username,
                email, 
                password: hashedPassword, 
                phone,
                role, 
                status 
            }
        )

        await newUser.save()
        res.status(201).json(
            { 
                success: true, 
                message: "User successfully registered" 
            }
        )
    } catch (err) {
        console.error("Error registering user:", err)
        res.status(500).json(
            { 
                success: false, 
                message: "Error registering user" 
            }
        )
    }
}

export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Buscar el usuario por email
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ message: "User not found" })
  
      // Verificar la contraseña
      const isMatch = await checkPassword(user.password, password)
      if (!isMatch) return res.status(401).json({ message: "Incorrect password" })
  
      // Generar token JWT
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "2h" })
  
      res.json({ token })
    } catch (err) {
      console.error("Login error:", err)
      res.status(500).json({ message: "Login failed" })
    }
  }
