import bcrypt from 'bcrypt' 
import User from "../user/user.model.js"
import jwt from "jsonwebtoken"
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from "../../utils/jwt.js"

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, role, status } = req.body
        const hashedPassword = await encrypt(password)
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

// Login corregido
export const loginUser = async (req, res) => {
    try {
        // Capturamos datos
        let { userLoggin, password } = req.body

        // Validar que el usuario exista
        let user = await User.findOne({
            $or: [{ email: userLoggin }, { username: userLoggin }]
        })

        // Verificar que la contraseña coincida
        if (user && await checkPassword(user.password, password)) {
            let loggerUser = {
                _id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }

            // Verificar que SECRET_KEY existe antes de generar el token
            if (!process.env.SECRET_KEY) {
                console.error("SECRET_KEY is missing in environment variables.")
                return res.status(500).send({ message: "Internal Server Error" })
            }

            // Generamos el Token
            let token = await generateJwt(loggerUser)

            return res.send({
                message: `Welcome ${user.name}`,
                loggerUser,
                token
            })
        }

        return res.status(400).send({ message: 'Wrong email or password' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error with login function' })
    }
}
