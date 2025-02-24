import { hash, verify } from "argon2"

// Encriptar la contraseña al registrar un usuario
export const encrypt = async (password) => {
  try {
    return await hash(password)
  } catch (err) {
    console.error("Error encrypting password:", err)
    return err
  }
}

// Verificar la contraseña al iniciar sesión
export const checkPassword = async (hashedPassword, password) => {
  try {
    return await verify(hashedPassword, password)
  } catch (err) {
    console.error("Error verifying password:", err)
    return err
  }
}
