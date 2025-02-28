import bcrypt from 'bcrypt'; 
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, role, status } = req.body
        const hashedPassword = await encrypt(password)  // Usar `argon2` para encriptar la contraseña
        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            phone,
            role,
            status,
        })

        await newUser.save()
        res.status(201).json({
            success: true,
            message: "User successfully registered",
        })
    } catch (err) {
        console.error("Error registering user:", err)
        res.status(500).json({
            success: false,
            message: "Error registering user",
        })
    }
}

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        // Buscar al usuario por nombre de usuario
        const user = await User.findOne({ username: req.body.username })

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" })
        }

        // Comparar la contraseña proporcionada con la almacenada usando bcrypt
        const validPassword = await bcrypt.compare(req.body.password, user.password)  // Usamos bcrypt para comparar

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid username or password" })
        }

        // Generar el token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.SECRET_KEY,  // Usamos la clave secreta
            { expiresIn: "1h" }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,  // Enviar el token JWT
        })
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message })
    }
}
