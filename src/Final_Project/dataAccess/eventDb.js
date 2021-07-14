const DataAccess = require('./db');
const { Event } = require('../models');

class EventDataAccess extends DataAccess {
  constructor() {
    super('events');
  }

  async getAllEvents() {
    const events = await this.getAll().map(
      (e) =>
        new Event(
          e.eventId,
          e.eventName,
          e.eventType,
          e.startDateTime,
          e.endDateTime
        )
    );

    return events;
  }
}

module.exports = new EventDataAccess();
