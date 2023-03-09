import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    valid: {
      type: Boolean,
      required: true,
      default: true
    },
    expires: {
      type: Date,
      required: true,
      default: Date.now(),
      index: {expires: '1m'}
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

 
const Token = mongoose.model('Token', tokenSchema);

export default Token;
