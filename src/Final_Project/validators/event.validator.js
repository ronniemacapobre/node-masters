const { body, query, check } = require('express-validator');
const { parseDateTime, parseDate } = require('../utilities/helpers');
const {
  eventDataAccess,
  memberDataAccess,
  attendanceDataAccess,
} = require('../dataAccess');

const isDateSearchValid = (dateValue) => {
  // Ignore validation if nothing to validate
  if (!dateValue) return true;

  // Parse the date
  const date = parseDate(dateValue, false);

  return date && !isNaN(date);
};

exports.validateEventReq = [
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
    .custom((value) => {
      const endDateTime = parseDateTime(value);

      if (!endDateTime || isNaN(endDateTime))
        throw new Error('Please use this date format: YYYY-MM-DD HH:MM:SS');

      return true;
    }),
  body().custom(({ startDateTime, endDateTime }) => {
    const sDate = parseDateTime(startDateTime);
    const eDate = parseDateTime(endDateTime);

    if (sDate >= eDate)
      throw new Error('Start Date should be earlier than End Date');

    return true;
  }),
];

exports.validateUpdateEventReq = [
  body('eventId')
    .exists()
    .withMessage('Event Id is required')
    .notEmpty()
    .withMessage('Event Id is required'),
  ...this.validateEventReq,
];

exports.validateSearchReq = [
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

exports.validateExportReq = [
  query('eventId').exists().withMessage('eventId is required'),
];

exports.validateDeleteEventReq = [check('id').not().isEmpty()];

exports.isEventIdExists = async (req, res, next) => {
  const eventId = req?.body?.eventId || req?.params?.id || req?.query?.eventId;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event)
    return next({
      statusCode: 404,
      errorMessage: 'Event not found',
    });

  next();
};

exports.validateMemberAttendances = async (req, res, next) => {
  const eventId = req.params.id;
  const attendances = await attendanceDataAccess.getByEventId(eventId);

  if (attendances && attendances.length > 0)
    return next({
      statusCode: 400,
      errorMessage:
        'Unable to delete event because there are member attendance in it.',
    });

  next();
};
