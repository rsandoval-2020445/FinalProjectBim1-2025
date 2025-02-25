import Cart from "./cart.model.js";

//Obtener carrito de un usuario
export const getCartByUser = async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.params.userId })
        .populate({
          path: "products.product",
          select: "name price stock category", 
          populate: {
            path: "category",
            select: "name" 
          }
        })
        .populate("user", "name email") 
      if (!cart) {
        cart = new Cart({ user: req.params.userId, products: [] })
        await cart.save()
      }
  
      res.json(cart)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  
  

//Agregar producto al carrito
export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body

    try {
        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = new Cart({ user: userId, products: [] })
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId)

        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            cart.products.push({ product: productId, quantity})
        }
        await cart.save()
        res.status(201).json(cart)
    } catch (err) {
        
    }
}

// Actualizar cantidad del producto en carrito
export const updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body
  
    try {
        const cart = await Cart.findOne({ user: userId })
  
        if (!cart) return res.status(404).json({ message: 'Cart not found' })
        const productItem = cart.products.find(p => p.product.toString() === productId)
  
        if (!productItem) return res.status(404).json({ message: 'Product not found in cart' })
        productItem.quantity = quantity
        await cart.save()
        res.json(cart)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body
  
    try {
      let cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { product: productId } } },
        { new: true }
      )
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' })
  
      // Si el carrito queda vacío después de eliminar el producto, eliminarlo de la base de datos
      if (cart.products.length === 0) {
        await Cart.findByIdAndDelete(cart._id)
        return res.json({ message: 'Cart deleted as it was empty' })
      }
  
      res.json(cart)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  