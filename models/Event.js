import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Restaurant ID is required'],
    ref: 'Restaurant'
  },
  event_title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Event title cannot exceed 200 characters']
  },
  event_description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Event description cannot exceed 1000 characters']
  },
  cover_image: {
    type: String,
    required: [true, 'Cover image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Cover image must be a valid image URL'
    }
  },
  entry_fee_per_person: {
    type: Number,
    required: [true, 'Entry fee per person is required'],
    min: [0, 'Entry fee cannot be negative']
  },
  start_date: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Start date cannot be in the past'
    }
  },
  end_date: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v >= this.start_date;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  start_time: {
    type: String,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  end_time: {
    type: String,
    required: [true, 'End time is required'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time must be in HH:MM format'
    }
  },
  contact_address: {
    type: String,
    required: [true, 'Contact address is required'],
    trim: true,
    maxlength: [500, 'Contact address cannot exceed 500 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: 'Mobile number must be in international format (e.g., +880123456789)'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
eventSchema.index({ restaurant_id: 1, start_date: 1 });
eventSchema.index({ is_active: 1 });

// Virtual for event status
eventSchema.virtual('status').get(function() {
  const now = new Date();
  const eventStart = new Date(`${this.start_date.toISOString().split('T')[0]}T${this.start_time}`);
  const eventEnd = new Date(`${this.end_date.toISOString().split('T')[0]}T${this.end_time}`);
  
  if (now < eventStart) return 'upcoming';
  if (now >= eventStart && now <= eventEnd) return 'ongoing';
  return 'completed';
});

export default mongoose.model('Event', eventSchema);