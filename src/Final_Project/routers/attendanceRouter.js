const express = require('express');
const { body } = require('express-validator');
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
  upsertAttendanceValidation,
} = require('../validators/attendance.validator');

const router = express.Router();

router.get('/', getAllAttendances);
router.post('/', upsertAttendanceValidation, checkRules, createAttendance);
router.put(
  '/:id',
  body('attendanceId')
    .exists()
    .withMessage('Attendance Id is required')
    .notEmpty()
    .withMessage('Attendance Id is required'),
  upsertAttendanceValidation,
  checkRules,
  updateAttendance
);
router.delete('/:id', deleteAttendance);

module.exports = router;
