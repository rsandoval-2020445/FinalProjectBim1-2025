import Product from "./product.model.js"
import Category from "../category/category.model.js"

// Crear un producto (solo ADMIN)
export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can create products" })
    }

    const { name, price, stock, category } = req.body

    // Verificar si la categoría existe antes de crear el producto
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" })
      }
    }

    const newProduct = new Product({ name, price, stock, category })
    await newProduct.save()

    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message })
  }
}

// Obtener todos los productos (público)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name")
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving products", error: err.message })
  }
}

// Obtener producto por ID (público)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name")
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving product", error: err.message })
  }
}

// Actualizar producto (solo ADMIN, verificando categoría y evitando valores nulos)
export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can update products" })
    }

    const { category } = req.body

    // Bloquear la actualización si se intenta eliminar la categoría
    if (Object.prototype.hasOwnProperty.call(req.body, "category") && !category) {
      return res.status(400).json({ message: "Category cannot be null" })
    }

    // Verificar si la categoría existe antes de actualizar el producto
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("category", "name")
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" })
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message })
  }
}

// Eliminar producto (solo ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can delete products" })
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message })
  }
}
