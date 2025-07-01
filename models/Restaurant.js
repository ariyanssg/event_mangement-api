import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Restaurant address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Restaurant phone is required']
  },
  email: {
    type: String,
    required: [true, 'Restaurant email is required'],
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Restaurant', restaurantSchema);