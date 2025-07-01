import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation for adding new event
export const validateEvent = [
  body('restaurant_id')
    .notEmpty()
    .withMessage('Restaurant ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid restaurant ID format');
      }
      return true;
    }),
  
  body('event_title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Event title cannot exceed 200 characters'),
  
  body('event_description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 1000 })
    .withMessage('Event description cannot exceed 1000 characters'),
  
  body('cover_image')
    .notEmpty()
    .withMessage('Cover image URL is required')
    .isURL()
    .withMessage('Cover image must be a valid URL')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('Cover image must be a valid image file (jpg, jpeg, png, gif, webp)'),
  
  body('entry_fee_per_person')
    .isNumeric()
    .withMessage('Entry fee must be a number')
    .isFloat({ min: 0 })
    .withMessage('Entry fee cannot be negative'),
  
  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be in valid date format (YYYY-MM-DD)')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be in valid date format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(value);
      if (endDate < startDate) {
        throw new Error('End date must be after or equal to start date');
      }
      return true;
    }),
  
  body('start_time')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('end_time')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('contact_address')
    .trim()
    .notEmpty()
    .withMessage('Contact address is required')
    .isLength({ max: 500 })
    .withMessage('Contact address cannot exceed 500 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Mobile number must be in international format (e.g., +880123456789)'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  handleValidationErrors
];

// Validation for updating event - SIMPLIFIED AND FIXED
export const validateEventUpdate = [
  body('_id')
    .notEmpty()
    .withMessage('Event ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid event ID format');
      }
      return true;
    }),
  
  // Only validate if field is present and not empty
  body('event_title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Event title must be between 1 and 200 characters'),
  
  body('event_description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Event description must be between 1 and 1000 characters'),
  
  body('cover_image')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Cover image must be a valid URL')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('Cover image must be a valid image file'),
  
  body('entry_fee_per_person')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Entry fee must be a number')
    .isFloat({ min: 0 })
    .withMessage('Entry fee cannot be negative'),
  
  body('start_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be in valid date format (YYYY-MM-DD)'),
  
  body('end_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be in valid date format (YYYY-MM-DD)'),
  
  body('start_time')
    .optional({ checkFalsy: true })
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('end_time')
    .optional({ checkFalsy: true })
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('contact_address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Contact address must be between 1 and 500 characters'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('mobile')
    .optional({ checkFalsy: true })
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Mobile number must be in international format'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  handleValidationErrors
];

// Validation for event ID (delete operation)
export const validateEventId = [
  body('_id')
    .notEmpty()
    .withMessage('Event ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid event ID format');
      }
      return true;
    }),
  
  handleValidationErrors
];