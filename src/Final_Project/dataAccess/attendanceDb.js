const DataAccess = require('./db');
const { Attendance } = require('../models');

class AttendanceDataAccess extends DataAccess {
  constructor() {
    super('attendances', 'attendanceId');
  }

  async getAttendanceById(attendanceId) {
    const attendance = await this.getById(attendanceId);
    return attendance ? new Attendance(attendance) : null;
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

  async getAllAttendances() {
    const data = await this.getAll();
    const attendances = data.map((attendance) => new Attendance(attendance));
    return attendances;
  }

  async createAttendance(data) {
    const attendance = await this.create(data);
    return new Attendance(attendance);
  }
}

module.exports = new AttendanceDataAccess();
