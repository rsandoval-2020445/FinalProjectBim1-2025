import Category from "./category.model.js"

// Crear categoría (solo ADMIN)
export const createCategory = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can create categories" })
    }

    const newCategory = new Category(req.body)
    await newCategory.save()
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message })
  }
}

// Obtener todas las categorías (público)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving categories", error: err.message })
  }
}

// Obtener categoría por ID (público)
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving category", error: err.message })
  }
}

// Actualizar categoría (solo ADMIN)
export const updateCategory = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can update categories" })
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" })
    res.json(updatedCategory)
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message })
  }
}

// Eliminar categoría (solo ADMIN)
export const deleteCategory = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can delete categories" })
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id)
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" })
    res.json({ message: "Category deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message })
  }
}
