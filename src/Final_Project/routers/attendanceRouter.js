const express = require('express');
const {
  attendanceController: {
    getAllAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  },
} = require('../controllers');
const { checkRules } = require('../validators');
const {
  validateAttendanceRequest,
  validateUpdateAttendanceRequest,
  isEventIdExists,
  isMemberExists,
  isAttendanceExists,
} = require('../validators/attendance.validator');

const router = express.Router();

router.get('/', getAllAttendances);
router.post(
  '/',
  validateAttendanceRequest,
  checkRules,
  isEventIdExists,
  isMemberExists,
  createAttendance
);
router.put(
  '/:id',
  validateUpdateAttendanceRequest,
  checkRules,
  isEventIdExists,
  isMemberExists,
  isAttendanceExists,
  updateAttendance
);
router.delete('/:id', isAttendanceExists, deleteAttendance);

module.exports = router;
