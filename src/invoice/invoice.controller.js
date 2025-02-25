import Invoice from './invoice.model.js';

//Crear una factura
export const createInvoice = async (req, res) => {
    try {
        console.log(req.body)
        
        const invoiceData = req.body
        const newInvoice = await Invoice.create(invoiceData)
        res.status(201).json(newInvoice)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}  

//Obtener una factura por ID
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate("user", "name email") // Muestra datos del usuario
            .populate(
                {
                    path: "products.product",
                    select: "name price category",
                    populate: {
                    path: "category",
                    select: "name"
                    }
                }
            )
            
        if (!invoice) return res.status(404).json({ message: "Invoice not found" })
        res.json(invoice)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
  

//Actualizar una factura
export const updateInvoice = async (req, res) => {
    try {
        const updateInvoce = await Invoice.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!updateInvoce) return res.status(404).json({message: 'Invoice not found'})
            res.json(updateInvoce)
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
}

//Eliminar una factura
export const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id)
        if (!deletedInvoice) return res.status(404).json({message: 'Invoce not found'})
            res.json({message: 'Invoice deleted successfully'})
    } catch (err) {
        res.status(500).send(
            { 
                message: err.message 
            }
        )
    }
}