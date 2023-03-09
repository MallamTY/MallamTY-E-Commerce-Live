import mongoose from 'mongoose';


const productSchema = new  mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true
    },
    main_mage_url: {
      type: String,
      required: [true, 'A product must have a main image']
    },
    main_image_id: {
        type: String
    },
    images_url: {
      type: [String],
      required: [true, 'A product must have sub images']
    },
    images_id: {
        type: Array,
        required: [true, 'A product must have sub images']
    },
    description: {
      type: String,
      required: [false, 'A product must have a description']
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category'
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    deliveryfee: {
      type: Number,
      required: true,
      default: 0
    },
    doordeliveryfee: {
      type: Number,
      required: true,
      default: 0
    },
    priceAfterDiscount: {
      type: Number,
      required: false,
      default: 0
    },
    // priceDiscount: {
    //   type: Number,
    //   validate: {
    //     validator: function (value) {
    //       // this only points to current doc on NEW documnet creation
    //       return value < this.price;
    //     },
    //     message: 'Discount price ({VALUE}) should be below regular price'
    //   }
    // },
    variation: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Variation'
      }
    ],
    quantity: {
      type: Number,
      default: 0,
      required: true
    },
    sold: {
      type: Number,
      default: 0
    },
    isOutOfStock: {
      type: Boolean,
      default: false
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val: number) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
