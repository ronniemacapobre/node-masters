const express = require('express');
const { check } = require('express-validator');
const {
  eventController: { getAllEvents, getEventById, addEvent, deleteEvent },
} = require('../controllers');
const eventValidator = require('../validators/event.validator');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post(
  '/',
  eventValidator.validationBodyRules,
  eventValidator.checkRules,
  addEvent
);
router.delete('/:id', check('id').notEmpty(), deleteEvent);

module.exports = router;
