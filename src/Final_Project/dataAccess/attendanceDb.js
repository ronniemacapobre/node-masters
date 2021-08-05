const DataAccess = require('./db');
const { Attendance } = require('../models');

class AttendanceDataAccess extends DataAccess {
  constructor() {
    super('attendances');
  }

  async getByEventId(eventId) {
    const data = await this.filterByAny({
      propName: 'eventId',
      propValue: eventId,
    });
    const attendances = data.map((attendance) => new Attendance(attendance));
    return attendances;
  }

  async getByMemberId(memberId) {
    const data = await this.filterByAny({
      propName: 'memberId',
      propValue: memberId,
    });
    const attendances = data.map((attendance) => new Attendance(attendance));
    return attendances;
  }
}

module.exports = new AttendanceDataAccess();
