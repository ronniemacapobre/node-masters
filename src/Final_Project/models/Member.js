class Member {
  constructor({ memberId, memberName, status, joinedDate }) {
    this.memberId = memberId;
    this.memberName = memberName;
    this.status = status;
    this.joinedDate = joinedDate ? new Date(joinedDate) : null;
  }
}

module.exports = Member;
