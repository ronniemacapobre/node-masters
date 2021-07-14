class Event {
  constructor(eventId, eventName, eventType, startDateTime, endDateTime) {
    this.eventId = eventId;
    this.eventName = eventName;
    this.eventType = eventType;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }
}

module.exports = Event;
