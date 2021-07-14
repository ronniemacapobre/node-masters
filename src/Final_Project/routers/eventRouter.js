const express = require('express');
const {
  eventController: { getAllEvents },
} = require('../controllers');

const router = express.Router();

router.get('/events', getAllEvents);

module.exports = router;
