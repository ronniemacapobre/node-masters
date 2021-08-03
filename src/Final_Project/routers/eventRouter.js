const express = require('express');
const { check, body, oneOf, query } = require('express-validator');
const {
  eventController: {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    exportEventMembers,
  },
} = require('../controllers');
const {
  validationBodyRules,
  checkRules,
  searchEventValidation,
  exportEventValidation,
} = require('../validators/event.validator');

const router = express.Router();

router.get('/search', searchEventValidation, checkRules, searchEvents);
router.get('/export', exportEventValidation, checkRules, exportEventMembers);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', validationBodyRules, checkRules, createEvent);
router.put(
  '/:eventId',
  body('eventId')
    .exists()
    .withMessage('Event Id is required')
    .notEmpty()
    .withMessage('Event Id is required'),
  validationBodyRules,
  checkRules,
  updateEvent
);
router.delete('/:id', check('id').not().isEmpty(), deleteEvent);

module.exports = router;
