class Attendance {
  constructor({ attendanceId, eventId, memberId, timeIn, timeOut = null }) {
    this.attendanceId = attendanceId;
    this.eventId = eventId;
    this.memberId = memberId;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
  }
}

module.exports = Attendance;
