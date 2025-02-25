import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import productRoutes from "../src/product/product.routes.js"
import categoryRoutes from "../src/category/category.routes.js"
import invoiceRoutes from "../src/invoice/invoice.routes.js"
import cartRoutes from "../src/cart/cart.routes.js"

const configs = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet())
  app.use(morgan("dev"))
}

const routes = (app) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/users", userRoutes)
  app.use("/api/products", productRoutes)
  app.use("/api/categories", categoryRoutes)
  app.use("/api/invoices", invoiceRoutes)
  app.use('/api/cart', cartRoutes)
}


export const initServer = async () => {
  const app = express()
  try {
    configs(app)
    routes(app)
    app.listen(process.env.PORT)
    console.log(`Server running on port ${process.env.PORT}`)
  } catch (err) {
    console.error("Server init failed:", err)
  }
}
