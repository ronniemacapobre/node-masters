const express = require('express');
const {
  eventController: { getAllEvents, getEventById },
} = require('../controllers');

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);

module.exports = router;
