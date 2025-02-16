import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        description: {
            type: String,
            required: true,
            maxLength: [200, `Can't be overcome 200 charecters`]
        }
    }
)

export default mongoose.model("Category", CategorySchema)
