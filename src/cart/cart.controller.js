import Cart from "./cart.model.js";
import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";

//Finalizar compra (Checkout)
export const checkout = async (req, res) => {
  try {
    const { userId, customerName, customerEmail } = req.body // Asegúrate de que se extraigan estos valores

    let cart = await Cart.findOne({ user: userId }).populate("products.product")
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" })
    }

    let totalAmount = 0
    const invoiceProducts = []

    for (let item of cart.products) {
      const product = await Product.findById(item.product._id)
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` })
      }
      product.stock -= item.quantity
      await product.save()
      totalAmount += product.price * item.quantity
      invoiceProducts.push({
        product: product._id,
        description: product.name,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Ahora pasamos customerName y customerEmail al crear la factura
    const newInvoice = new Invoice({
      user: userId,
      customerName: customerName,
      customerEmail: customerEmail,
      products: invoiceProducts,
      totalAmount: totalAmount
    })

    await newInvoice.save()
    await Cart.findByIdAndDelete(cart._id)

    res.json({ message: "Compra realizada con éxito", invoice: newInvoice })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// Obtener historial de compras
export const getPurchaseHistory = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate({
        path: "products.product",
        select: "name price category",
        populate: { path: "category", select: "name" }
      })

    res.json(invoices)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


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
  