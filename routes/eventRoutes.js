import express from 'express';
import {
  addEvent,
  updateEvent,
  getEventData,
  deleteEvent
} from '../controllers/eventController.js';
import { validateEvent, validateEventUpdate, validateEventId } from '../middleware/validation.js';

const router = express.Router();

// POST /api/v1/admin/addEvent
router.post('/addEvent', validateEvent, addEvent);

// PUT /api/v1/admin/updateEvent
router.put('/updateEvent', validateEventUpdate, updateEvent);

// GET /api/v1/admin/getEventData/:rid
router.get('/getEventData/:rid', getEventData);

// DELETE /api/v1/admin/DeleteEvent
router.delete('/DeleteEvent', validateEventId, deleteEvent);

export default router;