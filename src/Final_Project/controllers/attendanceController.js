const { attendanceDataAccess } = require('../dataAccess');

const getAllAttendances = async (req, res) => {
  const attendances = await attendanceDataAccess.getAllAttendances();
  res.status(200).send(attendances);
};

const createAttendance = async (req, res) => {
  const payload = req.body;
  const newAttendance = await attendanceDataAccess.createAttendance(payload);
  res.status(200).send(newAttendance);
};

const updateAttendance = async (req, res) => {
  const { attendanceId } = req.body;

  const updatedAttendance = await attendanceDataAccess.update(
    attendanceId,
    req.body
  );

  res.status(200).send(updatedAttendance);
};

const deleteAttendance = async (req, res) => {
  const attendanceId = req.params.id;
  await attendanceDataAccess.delete(attendanceId);
  res.status(200).send();
};

module.exports = {
  getAllAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
