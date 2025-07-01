import Event from '../models/Event.js';
import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';

// @desc    Add a new event
// @route   POST /api/v1/admin/addEvent
// @access  Admin
export const addEvent = async (req, res) => {
  try {
    const {
      restaurant_id,
      event_title,
      event_description,
      cover_image,
      entry_fee_per_person,
      start_date,
      end_date,
      start_time,
      end_time,
      contact_address,
      email,
      mobile,
      is_active
    } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Validate time logic
    if (start_date === end_date && start_time >= end_time) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time for same-day events'
      });
    }

    // Create new event
    const event = new Event({
      restaurant_id,
      event_title,
      event_description,
      cover_image,
      entry_fee_per_person,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      start_time,
      end_time,
      contact_address,
      email,
      mobile,
      is_active: is_active !== undefined ? is_active : true
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });

  } catch (error) {
    console.error('Add Event Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update an existing event
// @route   PUT /api/v1/admin/updateEvent
// @access  Admin
export const updateEvent = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    // Check if event exists
    const existingEvent = await Event.findById(_id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate time logic if both dates and times are being updated
    if (updateData.start_date && updateData.end_date && updateData.start_time && updateData.end_time) {
      if (updateData.start_date === updateData.end_date && updateData.start_time >= updateData.end_time) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time for same-day events'
        });
      }
    }

    // Convert date strings to Date objects if provided
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date);
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date);
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      _id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Update Event Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all events for a restaurant
// @route   GET /api/v1/admin/getEventData/:rid
// @access  Admin
export const getEventData = async (req, res) => {
  try {
    const { rid } = req.params;

    // Validate restaurant ID format
    if (!mongoose.Types.ObjectId.isValid(rid)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID format'
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(rid);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get events for the restaurant
    const events = await Event.find({ restaurant_id: rid })
      .sort({ start_date: 1, start_time: 1 })
      .populate('restaurant_id', 'name address phone email');

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Get Event Data Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/v1/admin/DeleteEvent
// @access  Admin
export const deleteEvent = async (req, res) => {
  try {
    const { _id } = req.body;

    // Check if event exists
    const event = await Event.findById(_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {
        deleted_event_id: _id,
        deleted_event_title: event.event_title
      }
    });

  } catch (error) {
    console.error('Delete Event Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};