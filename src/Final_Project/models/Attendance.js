class Attendance {
  constructor(attendanceId, timeIn, timeOut = null) {
    this.attendanceId = attendanceId;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
  }
}

module.exports = Attendance;
