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

const createMember = async (req, res) => {
  const payload = req.body;
  const newMember = await memberDataAccess.createMember(payload);
  res.status(200).send(newMember);
};

const updateMember = async (req, res) => {
  const memberId = req.params.id;
  const payload = req.body;
  const updatedMember = await memberDataAccess.update(memberId, payload);
  res.status(200).send(updatedMember);
};

const deleteMember = async (req, res) => {
  const memberId = req.params.id;
  await memberDataAccess.delete(memberId);
  res.status(200).send();
};

searchMembers = async (req, res) => {
  let { name, status } = req.query;
  const filteredMembers = await memberDataAccess.searchMembers(name, status);
  res.status(200).send(filteredMembers);
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
};
