import mongoose from 'mongoose';
import { getAssetUrl } from '../utils/helper';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  photo: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  },
}, {
  virtuals: {
    photoUrl: {
      get() {
        return `${getAssetUrl('photos')}${this.photo}`
      }
    }
  },
  toJSON: {
    virtuals: true
  }
});

export default mongoose.model('User', userSchema, 'users')
