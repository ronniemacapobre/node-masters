const { attendanceDataAccess } = require('../dataAccess');

const getAllAttendances = async (req, res) => {
  const attendances = await attendanceDataAccess.getAllAttendances();
  res.status(200).send(attendances);
};

module.exports = {
  getAllAttendances,
};
