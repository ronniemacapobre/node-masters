const { body } = require('express-validator');
const { parseDateTime } = require('../utilities/helpers');

exports.upsertAttendanceValidation = [
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
