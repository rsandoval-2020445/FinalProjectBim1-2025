// src/configs/mongo.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import { initApp } from "./init.js" // Importar la función de inicialización

dotenv.config() // Cargar variables de entorno

export const connect = async () => {
  try {
    // MongoDB connection lifecycle events
    mongoose.connection.on("error", () => console.log("MongoDB | Could not connect to database"))
    mongoose.connection.on("connecting", () => console.log("MongoDB | Trying to connect..."))
    mongoose.connection.on("connected", () => console.log("MongoDB | Successfully connected"))
    mongoose.connection.once("open", async () => {
      console.log("MongoDB | Database connection is open")

      // Ejecutar la creación de admin y categoría solo si no existen
      await initApp()  // Llamar a la función que crea admin y categoría
    })
    mongoose.connection.on("reconnected", () => console.log("MongoDB | Reconnected"))
    mongoose.connection.on("disconnected", () => console.log("MongoDB | Disconnected"))

    // Obtener las credenciales de la base de datos desde el archivo .env
    const { DB_SERVICE, DB_HOST, DB_PORT, DB_NAME } = process.env

    // Validar las variables de entorno
    if (!DB_SERVICE || !DB_HOST || !DB_PORT || !DB_NAME) {
      throw new Error("Missing database environment variables. Check your .env file.")
    }

    const uri = `${DB_SERVICE}://${DB_HOST}:${DB_PORT}/${DB_NAME}`

    // Intentar la conexión a la base de datos
    await mongoose.connect(uri, {
      maxPoolSize: 50, // Máximo de conexiones
      serverSelectionTimeoutMS: 5000, // Tiempo máximo de intento de conexión
    })

  } catch (err) {
    console.error("Database connection failed:", err.message)
    process.exit(1) // Detener el servidor si la conexión a la base de datos falla
  }
}
