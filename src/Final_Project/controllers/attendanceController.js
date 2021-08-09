const {
  attendanceDataAccess,
  memberDataAccess,
  eventDataAccess,
} = require('../dataAccess');

const getAllAttendances = async (req, res) => {
  const attendances = await attendanceDataAccess.getAllAttendances();
  res.status(200).send(attendances);
};

const createAttendance = async (req, res) => {
  const { eventId, memberId } = req.body;

  // Check if event exists
  const event = await eventDataAccess.getEventById(eventId);
  if (!event) return res.status(404).send('Event Id not found');

  // Check if member exists
  const member = await memberDataAccess.getMemberById(memberId);
  if (!member) return res.status(404).send('Member Id not found');

  const payload = req.body;

  const newAttendance = await attendanceDataAccess.createAttendance(payload);
  res.status(200).send(newAttendance);
};

const updateAttendance = async (req, res) => {
  const { attendanceId, eventId, memberId } = req.body;

  // Check if attendance id from query param and body are the same
  if (req.params.id !== attendanceId)
    return res.status(404).send('Attendance Id mismatch');

  // Check if attendance exists
  const attendance = await attendanceDataAccess.getAttendanceById(attendanceId);
  if (!attendance) return res.status(404).send('Attendance Id not found');

  // Check if event exists
  const event = await eventDataAccess.getEventById(eventId);
  if (!event) return res.status(404).send('Event Id not found');

  // Check if member exists
  const member = await memberDataAccess.getMemberById(memberId);
  if (!member) return res.status(404).send('Member Id not found');

  const updatedAttendance = await attendanceDataAccess.update(
    attendanceId,
    req.body
  );

  res.status(200).send(updatedAttendance);
};

module.exports = {
  getAllAttendances,
  createAttendance,
  updateAttendance,
};
