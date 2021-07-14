class Member {
  constructor(memberId, name, status, joinedDate = null) {
    this.memberId = memberId;
    this.name = name;
    this.status = status;
    this.joinedDate = joinedDate;
  }
}

module.exports = Member;
