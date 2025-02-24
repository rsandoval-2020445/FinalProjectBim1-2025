// Database connection
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config() // Load environment variables

export const connect = async () => {
  try {
    // MongoDB connection lifecycle events
    mongoose.connection.on("error", () => console.log("MongoDB | Could not connect to database"))
    mongoose.connection.on("connecting", () => console.log("MongoDB | Trying to connect..."))
    mongoose.connection.on("connected", () => console.log("MongoDB | Successfully connected"))
    mongoose.connection.once("open", () => console.log("MongoDB | Database connection is open"))
    mongoose.connection.on("reconnected", () => console.log("MongoDB | Reconnected"))
    mongoose.connection.on("disconnected", () => console.log("MongoDB | Disconnected"))

    // Retrieve database credentials from .env
    const { DB_SERVICE, DB_HOST, DB_PORT, DB_NAME } = process.env

    // Validate environment variables
    if (!DB_SERVICE || !DB_HOST || !DB_PORT || !DB_NAME) {
      throw new Error("Missing database environment variables. Check your .env file.")
    }

    const uri = `${DB_SERVICE}://${DB_HOST}:${DB_PORT}/${DB_NAME}`

    // Attempt database connection
    await mongoose.connect(uri, {
      maxPoolSize: 50, // Maximum connections
      serverSelectionTimeoutMS: 5000, // Maximum connection attempt time
    })

  } catch (err) {
    console.error("Database connection failed:", err.message)
    process.exit(1) // Stop server if database connection fails
  }
}
