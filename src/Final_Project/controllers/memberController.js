const {
  memberDataAccess,
  attendanceDataAccess,
  eventDataAccess,
} = require('../dataAccess');

const getAllMembers = async (req, res) => {
  const members = await memberDataAccess.getAllMembers();
  res.status(200).send(members);
};

const getMemberById = async (req, res) => {
  const memberId = req.params.id;
  const member = await memberDataAccess.getMemberById(memberId);

  if (!member) return res.status(404).send('Event not found!');

  const data = await attendanceDataAccess.getByMemberId(memberId);
  const eventAttendances = await Promise.all(
    data.map(async ({ eventId, timeIn, timeOut }) => {
      const { eventName } = await eventDataAccess.getEventById(eventId);
      return {
        eventName,
        timeIn,
        timeOut,
      };
    })
  );

  const memberDetails = {
    memberId,
    eventAttendances,
  };

  res.status(200).send(memberDetails);
};

module.exports = {
  getAllMembers,
  getMemberById,
};
