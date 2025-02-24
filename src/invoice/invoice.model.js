import mongoose from 'mongoose'

const InvoiceSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User', 
            required: true 
        },
        customerName: { 
            type: String, 
            required: true 
        },
        customerEmail: { 
            type: String, 
            required: true 
        },
        products: [{
            product: { 
                type: mongoose.Schema.Types.ObjectId, ref: 'Product', 
                required: true 
            },
            description: { 
                type: String, 
                required: true 
            },
            quantity: { 
                type: Number,
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            }
        }],
        totalAmount: { 
            type: Number, 
            required: true 
        },
        invoiceDate: { 
            type: Date, 
            default: Date.now 
        }
    }
)

export default mongoose.model('Invoice', InvoiceSchema) 