import mongoose from "mongoose";


const doorDelivery = new mongoose.Schema({
    state: {
        type: String,
        required: [true, `State field must be specified and must be a valid state in your country`],
        trim: true,
    },
    deliveryfee: {
        type: Number,
        required: [true, `Delivery fee must be specified`],
        default: 0,
        trim: true
    }
}, 
{timestamps: true});

const deliveryFeeModel = mongoose.model('Door_Delivery', doorDelivery);
export default deliveryFeeModel;

