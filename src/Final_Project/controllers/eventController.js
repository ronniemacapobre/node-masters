const {
  eventDataAccess,
  attendanceDataAccess,
  memberDataAccess,
} = require('../dataAccess');
const { parseDate } = require('../utilities/helpers');

const getMemberAttendances = async (eventId) => {
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

  return memberAttendances;
};

const getAllEvents = async (req, res) => {
  const events = await eventDataAccess.getAllEvents();

  const eventsWithAttendance = await Promise.all(
    events.map(async (event) => {
      const memberAttendances = await getMemberAttendances(event.eventId);
      event.memberAttendances = [...memberAttendances];
      return event;
    })
  );

  res.status(200).send(eventsWithAttendance);
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event) res.status(404).send('Event not found!');

  const memberAttendances = await getMemberAttendances(eventId);
  event.memberAttendances = [...memberAttendances];

  res.status(200).send(event);
};

const createEvent = async (req, res) => {
  try {
    const payload = req.body;
    const newEvent = await eventDataAccess.createEvent(payload);
    res.status(200).send(newEvent);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const payload = req.body;
  const updatedEvent = await eventDataAccess.update(eventId, payload);
  res.status(200).send(updatedEvent);
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event) res.status(404).send('Event not found!');

  const memberAttendances = await getMemberAttendances(eventId);

  if (memberAttendances && memberAttendances.length > 0) {
    return res
      .status(400)
      .send(
        `Unable to delete Event: ${event.eventName} because there are member attendance in it.`
      );
  }

  await eventDataAccess.delete(eventId);

  res.status(200).send();
};

searchEvents = async (req, res) => {
  let { eventName, dateStart, dateEnd } = req.query;

  dateStart = parseDate(dateStart, false);
  dateEnd = parseDate(dateEnd, false);

  const filteredEvents = await eventDataAccess.searchEvents(
    eventName,
    dateStart,
    dateEnd
  );

  res.status(200).send(filteredEvents);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
};
