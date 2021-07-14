const DataAccess = require('./db');

class AttendanceDataAccess extends DataAccess {
  constructor() {
    super('attendances');
  }
}

module.exports = new AttendanceDataAccess();
