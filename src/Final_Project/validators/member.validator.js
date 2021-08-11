const { body, query } = require('express-validator');
const { parseDateTime } = require('../utilities/helpers');
const {
  eventDataAccess,
  memberDataAccess,
  attendanceDataAccess,
} = require('../dataAccess');

exports.validateMemberReq = [
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

exports.validateUpdateMemberReq = [
  body('memberId')
    .exists()
    .withMessage('Member Id is required')
    .notEmpty()
    .withMessage('Member Id is required'),
  this.validateMemberReq,
  body().custom((value, { req }) => {
    const id = req.params.id;
    const { memberId } = value;
    if (id !== memberId) throw new Error('Member Id mismatch');
    return true;
  }),
];

exports.validateSearchReq = [
  query().custom((value) => {
    const { name, status } = value;

    if (!name || !status)
      throw new Error('Please provide name and status as search criteria');

    return true;
  }),
];

exports.isMemberIdExists = async (req, res, next) => {
  const memberId = req?.body?.memberId || req?.params?.id;
  const member = await memberDataAccess.getMemberById(memberId);

  if (!member) return res.status(404).send('Member not found');

  next();
};

exports.validateEventAttendances = async (req, res, next) => {
  const memberId = req.params.id;
  const attendances = await attendanceDataAccess.getByMemberId(memberId);

  if (attendances && attendances.length > 0) {
    return res
      .status(400)
      .send(
        `Unable to delete event because there are member attendance in it.`
      );
  }

  next();
};
