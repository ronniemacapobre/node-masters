const express = require('express');
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
  validateEventReq,
  validateUpdateEventReq,
  validateSearchReq,
  validateExportReq,
  validateDeleteEventReq,
  isEventIdExists,
  validateMemberAttendances,
} = require('../validators/event.validator');
const { checkRules } = require('../validators');

const router = express.Router();

router.get('/search', validateSearchReq, checkRules, searchEvents);
router.get(
  '/export',
  validateExportReq,
  checkRules,
  isEventIdExists,
  exportEventMembers
);
router.get('/', getAllEvents);
router.get('/:id', isEventIdExists, getEventById);
router.post('/', validateEventReq, checkRules, createEvent);
router.put('/:eventId', validateUpdateEventReq, checkRules, updateEvent);
router.delete(
  '/:id',
  validateDeleteEventReq,
  checkRules,
  isEventIdExists,
  validateMemberAttendances,
  deleteEvent
);

module.exports = router;
