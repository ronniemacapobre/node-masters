class Event {
  constructor({ eventId, eventName, eventType, startDateTime, endDateTime }) {
    this.eventId = eventId;
    this.eventName = eventName;
    this.eventType = eventType;
    this.startDateTime = startDateTime ? new Date(startDateTime) : null;
    this.endDateTime = endDateTime ? new Date(endDateTime) : null;
    this.memberAttendances = [];
  }
}

module.exports = Event;
