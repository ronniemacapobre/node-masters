class Attendance {
  constructor({ attendanceId, eventId, memberId, timeIn, timeOut }) {
    this.attendanceId = attendanceId;
    this.eventId = eventId;
    this.memberId = memberId;
    this.timeIn = timeIn ? new Date(timeIn) : null;
    this.timeOut = timeOut ? new Date(timeOut) : null;
  }
}

module.exports = Attendance;
