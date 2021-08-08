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

const createMember = async (req, res) => {
  try {
    const payload = req.body;
    const newMember = await memberDataAccess.createMember(payload);
    res.status(200).send(newMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const payload = req.body;

    if (memberId !== payload.memberId)
      return res.status(404).send('Member Id mismatch');

    const member = await memberDataAccess.getById(memberId);
    if (!member) return res.status(404).send('Member Id not found!');

    const updatedMember = await memberDataAccess.update(memberId, payload);
    res.status(200).send(updatedMember);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const deleteMember = async (req, res) => {
  const memberId = req.params.id;

  const member = await memberDataAccess.getById(memberId);
  if (!member) return res.status(404).send('Member Id not found!');

  const data = await attendanceDataAccess.getByMemberId(memberId);
  if (data.length > 0)
    return res
      .status(400)
      .send('Unable to delete. Event attendance is existing');

  await memberDataAccess.delete(memberId);

  res.status(200).send();
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
