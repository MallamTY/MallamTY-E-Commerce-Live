import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    products: [
        {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
        }
    ]
}, {timestamps: true});

const favourite = mongoose.model('Favourite', favouriteSchema);
export default favourite;

