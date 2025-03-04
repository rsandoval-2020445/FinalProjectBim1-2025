import Category from "../src/category/category.model.js"
import bcrypt from 'bcrypt'
import User from '../src/user/user.model.js'
import { encrypt } from "../utils/encrypt.js"

const createAdmin = async () => {
  const adminExists = await User.findOne({ username: "admin" })
  if (!adminExists) {
    const hashedPassword = await encrypt("Password123!") // Contraseña predeterminada
    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin",  // Agregar el nombre
      surname: "Admin",  // Agregar el apellido
      email: "admin@example.com",  // Agregar el email
      phone: "1234567890",  // Agregar el teléfono
    })
    await admin.save()
    console.log("Admin created successfully")
  } else {
    console.log("Admin already exists")
  }
}

// Función para crear la categoría por defecto si no existe
const createDefaultCategory = async () => {
  const categoryExists = await Category.findOne({ name: "Default Category" })
  if (!categoryExists) {
    const category = new Category({
      name: "Default Category",
      description: "This is a default category",
    })
    await category.save()
    console.log("Default category created successfully")
  } else {
    console.log("Default category already exists")
  }
}

// Exportamos la función que inicializa todo
export const initApp = async () => {
  await createAdmin()
  await createDefaultCategory()
}
