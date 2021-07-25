const DataAccess = require('./db');
const { Event } = require('../models');

class EventDataAccess extends DataAccess {
  constructor() {
    super('events');
  }

  async getAllEvents() {
    const data = await this.getAll();
    const events = data.map((event) => new Event(event));
    return events;
  }

  async getEventById(eventId) {
    const event = await this.getByAny({
      propName: 'eventId',
      propValue: eventId,
    });
    return new Event(event);
  }

  async createEvent(data) {
    const newEvent = await this.create({
      propIdName: 'eventId',
      data,
    });

    return newEvent;
  }
}

module.exports = new EventDataAccess();
