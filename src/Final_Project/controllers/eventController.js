const {
  eventDataAccess,
  attendanceDataAccess,
  memberDataAccess,
} = require('../dataAccess');

const getAllEvents = async (req, res) => {
  const events = await eventDataAccess.getAllEvents();

  res.status(200).send(events);
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event) res.status(404).send('Event not found!');

  // Get Attendances of the Event
  const attendances = await attendanceDataAccess.getByEventId(eventId);

  // Prepare Member-Attendance object
  const memberAttendances = await Promise.all(
    attendances.map(async ({ memberId, timeIn, timeOut }) => {
      const { name } = await memberDataAccess.getMemberById(memberId);
      return {
        memberId,
        name,
        timeIn,
        timeOut,
      };
    })
  );

  event.memberAttendances = [...memberAttendances];

  res.status(200).send(event);
};

module.exports = {
  getAllEvents,
  getEventById,
};
