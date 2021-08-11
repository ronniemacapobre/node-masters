const { body } = require('express-validator');
const {
  eventDataAccess,
  memberDataAccess,
  attendanceDataAccess,
} = require('../dataAccess');
const { parseDateTime } = require('../utilities/helpers');

exports.validateAttendanceRequest = [
  body('memberId')
    .exists()
    .withMessage('Member Id is required')
    .not()
    .isEmpty()
    .withMessage('Member Id is required'),
  body('eventId')
    .exists()
    .withMessage('Event Id is required')
    .not()
    .isEmpty()
    .withMessage('Event Id is required'),
  body('timeIn')
    .exists()
    .withMessage('Time In is required')
    .not()
    .isEmpty()
    .withMessage('Time In is required'),
  body().custom(({ timeIn, timeOut }) => {
    // Validate timeIn first
    const timeInDate = parseDateTime(timeIn);

    if (!timeInDate || isNaN(timeInDate))
      throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

    // End validation if timeOut isn't provided
    if (!timeOut) return true;

    // Validate timeOut
    const timeOutDate = parseDateTime(timeOut);

    if (!timeOutDate || isNaN(timeOutDate))
      throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

    // timeIn should be earlier than timeOut
    if (timeInDate >= timeOutDate)
      throw new Error('Time In should be earlier than Time Out');

    return true;
  }),
];

exports.validateUpdateAttendanceRequest = [
  body('attendanceId')
    .exists()
    .withMessage('Attendance Id is required')
    .notEmpty()
    .withMessage('Attendance Id is required'),
  ...this.validateAttendanceRequest,
  body().custom((value, { req }) => {
    const id = req.params.id;
    const { attendanceId } = value;
    if (id !== attendanceId) throw new Error('Attendance Id mismatch');
    return true;
  }),
];

exports.isEventIdExists = async (req, res, next) => {
  const { eventId } = req.body;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event) return res.status(404).send('Event not found');

  next();
};

exports.isMemberExists = async (req, res, next) => {
  const { memberId } = req.body;
  const member = await memberDataAccess.getMemberById(memberId);
  if (!member) return res.status(404).send('Member not found');

  next();
};

exports.isAttendanceExists = async (req, res, next) => {
  const attendanceId = req.body.attendanceId || req.params.id;
  const attendance = await attendanceDataAccess.getAttendanceById(attendanceId);
  if (!attendance) return res.status(404).send('Attendance Id not found');

  next();
};
