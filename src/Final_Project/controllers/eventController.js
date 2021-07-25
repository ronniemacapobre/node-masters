const { validationResult } = require('express-validator');
const {
  eventDataAccess,
  attendanceDataAccess,
  memberDataAccess,
} = require('../dataAccess');

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

const addEvent = async (req, res) => {
  try {
    const payload = req.body;
    const newEvent = await eventDataAccess.createEvent(payload);
    res.status(200).send(newEvent);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const event = await eventDataAccess.getEventById(eventId);

  if (!event) res.status(404).send('Event not found!');

  const memberAttendances = await getMemberAttendances(eventId);

  if (memberAttendances && memberAttendances.length > 0)
    res
      .status(400)
      .send(
        `Unable to delete Event: ${event.eventName} because there are member attendance in it.`
      );

  //await eventDataAccess.deleteEvent(eventId);

  res.status(200).send();
};

module.exports = {
  getAllEvents,
  getEventById,
  addEvent,
  deleteEvent,
};
