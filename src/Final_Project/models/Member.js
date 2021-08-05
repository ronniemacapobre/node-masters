class Member {
  constructor({ memberId, name, status, joinedDate }) {
    this.memberId = memberId;
    this.name = name;
    this.status = status;
    this.joinedDate = joinedDate ? new Date(joinedDate) : null;
  }
}

module.exports = Member;
