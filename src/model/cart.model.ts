import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    customer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
      {
        product: { 
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        selectedVariation: {
          type: mongoose.Types.ObjectId,
          ref: 'Variation'
        },
        totalProductQuantity: {
          type: Number,
          required: true
        },
        totalProductPrice: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);


// cartSchema.pre('save', function (next) {
//   this.populate([
//     {
//       path: 'items.selectedColor',
//       select: 'color'
//     },
//     {
//       path: 'items.selectedSize',
//       select: 'size'
//     }
//   ]);

//   next();
// });

// cartSchema.pre(/^find/, function (next) {
//   this.populate([
//     {
//       path: 'items.selectedColor',
//       select: 'color'
//     },
//     {
//       path: 'items.selectedSize',
//       select: 'size'
//     }
//   ]);

//   next();
// });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
