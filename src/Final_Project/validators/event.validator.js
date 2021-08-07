const { body, query } = require('express-validator');
const { parseDateTime, parseDate } = require('../utilities/helpers');

const isDateSearchValid = (dateValue) => {
  // Ignore validation if nothing to validate
  if (!dateValue) return true;

  // Parse the date
  const date = parseDate(dateValue, false);

  return date && !isNaN(date);
};

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

exports.searchEventValidation = [
  query('dateStart')
    .custom((value) => isDateSearchValid(value))
    .withMessage('Please use this date format: YYYY_MM_DD'),
  query('dateEnd')
    .custom((value) => isDateSearchValid(value))
    .withMessage('Please use this date format: YYYY_MM_DD'),
  query().custom((value) => {
    const { eventName, dateStart, dateEnd } = value;

    // Don't allow search with no criteria
    if (!eventName && !dateStart && !dateEnd)
      throw new Error(
        'Please check if any of the ff criteria has been provided: eventName, dateStart, dateEnd.'
      );

    let isDateStartValid = true;
    if (dateStart) isDateStartValid = isDateSearchValid(dateStart);

    let isDateEndValid = true;
    if (isDateEndValid) isDateEndValid = isDateSearchValid(dateEnd);

    return isDateStartValid && isDateEndValid;
  }),
];

exports.exportEventValidation = [
  query('eventId').exists().withMessage('eventId is required'),
];
