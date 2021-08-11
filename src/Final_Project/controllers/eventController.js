const path = require('path');
const {
  eventDataAccess,
  attendanceDataAccess,
  memberDataAccess,
} = require('../dataAccess');
const { parseDate } = require('../utilities/helpers');
const { exportToExcel } = require('../utilities/exportToExcel');

const EXPORT_DIRECTORY = './src/Final_Project/exports';

const getMemberAttendances = async (eventId) => {
  // Get Attendances of the Event
  const attendances = await attendanceDataAccess.getByEventId(eventId);

  // Prepare Member-Attendance object
  const memberAttendances = await Promise.all(
    attendances.map(async ({ memberId, timeIn, timeOut }) => {
      const { memberName } = await memberDataAccess.getMemberById(memberId);
      return {
        memberId,
        memberName,
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
  const memberAttendances = await getMemberAttendances(eventId);
  event.memberAttendances = [...memberAttendances];
  res.status(200).send(event);
};

const createEvent = async (req, res) => {
  const payload = req.body;
  const newEvent = await eventDataAccess.createEvent(payload);
  res.status(200).send(newEvent);
};

const updateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const payload = req.body;
  const updatedEvent = await eventDataAccess.update(eventId, payload);
  res.status(200).send(updatedEvent);
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
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

exportEventMembers = async (req, res) => {
  // Get event
  const { eventId } = req.query;
  const event = await eventDataAccess.getEventById(eventId);

  // Get event members
  const memberAttendances = await getMemberAttendances(eventId);

  // Sanitize filename and date
  const cleanEventName = event.eventName.replace(/ /g, '_');
  const cleanStartDate = event.startDateTime
    .toLocaleDateString()
    .replace(/\//g, '_');
  const cleanStartTime = event.startDateTime
    .toLocaleTimeString()
    .replace(/:/g, '_')
    .replace(/ /, '_');

  const filename = `${cleanEventName}__${cleanStartDate}_${cleanStartTime}.xlsx`;
  const fullPath = path.join(EXPORT_DIRECTORY, filename);
  const headers = ['Member Name', 'Time-In', 'Time-Out'];
  const dataProps = ['memberName', 'timeIn', 'timeOut'];

  memberAttendances.sort((a, b) => {
    const leftDate = new Date(a.timeIn);
    const rightDate = new Date(b.timeIn);

    return leftDate > rightDate ? 1 : -1;
  });

  exportToExcel(fullPath, headers, dataProps, memberAttendances);

  //res.download(fullPath, filename);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  exportEventMembers,
};
