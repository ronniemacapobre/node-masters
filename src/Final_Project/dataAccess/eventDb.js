const DataAccess = require('./db');
const { Event } = require('../models');

class EventDataAccess extends DataAccess {
  constructor() {
    super('events', 'eventId');
  }

  async getAllEvents() {
    const data = await this.getAll();
    const events = data.map((event) => new Event(event));
    return events;
  }

  async getEventById(eventId) {
    const event = await this.getById(eventId);
    return event ? new Event(event) : null;
  }

  async createEvent(data) {
    const event = await this.create(data);
    return new Event(event);
  }
}

module.exports = new EventDataAccess();
