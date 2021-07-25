const { body, validationResult, check } = require('express-validator');
const { getEventById } = require('../controllers/eventController');
const { parseDateTime } = require('../utilities/helpers');

exports.validationBodyRules = [
  body('eventName')
    .exists()
    .withMessage('Event Name is required')
    .not()
    .isEmpty()
    .withMessage('Event Name cannot be empty'),
  body('eventType')
    .exists()
    .withMessage('Event Type is required')
    .not()
    .isEmpty()
    .withMessage('Event Type cannot be empty'),
  body('startDateTime')
    .exists()
    .withMessage('Start Date is required')
    .not()
    .isEmpty()
    .withMessage('Start Date cannot be empty')
    .custom((value) => {
      const date = parseDateTime(value);

      if (!date || isNaN(date))
        throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

      return true;
    }),
  body('endDateTime')
    .exists()
    .withMessage('End Date is required')
    .not()
    .isEmpty()
    .withMessage('End Date cannot be empty')
    .custom((value, { req }) => {
      const startDateTime = parseDateTime(req.body.startDateTime);
      const endDateTime = parseDateTime(value);

      if (!endDateTime || isNaN(endDateTime))
        throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

      if (startDateTime >= endDateTime)
        throw new Error('Start Date should be earlier than End Date');

      return true;
    }),
];

exports.checkRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  next();
};
