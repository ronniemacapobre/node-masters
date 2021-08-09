const express = require('express');
const {
  attendanceController: { getAllAttendances },
} = require('../controllers');

const router = express.Router();

router.get('/', getAllAttendances);

module.exports = router;
