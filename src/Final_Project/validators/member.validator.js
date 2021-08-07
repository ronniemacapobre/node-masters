const { body } = require('express-validator');
const { parseDateTime } = require('../utilities/helpers');

exports.createMemberValidation = [
  body('memberName')
    .exists()
    .withMessage('Member Name is required')
    .not()
    .isEmpty()
    .withMessage('Member Name cannot be empty'),
  body('status')
    .exists()
    .withMessage('Status is required')
    .not()
    .isEmpty()
    .withMessage('Status cannot be empty'),
  body('joinedDate').custom((value) => {
    // Dont' validate if joined date is not provided
    if (!value) return true;

    const date = parseDateTime(value);

    if (!date || isNaN(date))
      throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

    return true;
  }),
];
