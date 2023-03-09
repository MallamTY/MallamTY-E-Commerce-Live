// Packages
import mongoose from 'mongoose';



const sizeSchema = new mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
      }
    ],
    size: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Size = mongoose.model('Size', sizeSchema);

export default Size;
