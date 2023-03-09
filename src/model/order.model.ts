import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Array
    },
    paidFor: {
        type: Boolean,
        default: false
    },
    timePaid: {
        type: Date
    },
    phone: {
        type: Number,
        trim: true,
        minlength: [11, `Phone number can't be less than 11 characters`]
    },
    name: {
        type: String,
        trim: true,
        required: [true, `Receivers name can't be empty`]
    },
    deliverymethod: {
        type: String,
        enum: ['Pickup Station', 'Door Delivery'],
        default: 'Pickup Station'
    },
    delivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveryDate: {
        type: Date
    },
    shippingmethod: {
        type: String,
        enum: ['express', 'abroad', 'non express']
    },
    subtotal: {
        type: Number,
        required: true,
    },
    deliveryfee: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    paymentmethod: {
        type: String,
        enum: ["card", "bank", "ussd", "bank_transfer"]
    },
    txref: {
        type: String,
        required: true,
        default: ' '
    },
    status: {
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered','Pending Confirmation', 'Returned','Return In Progress' , 'Cancelled']
      }
})


const order = mongoose.model('Order', orderSchema);
export default order;