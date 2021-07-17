const DataAccess = require('./db');
const { Member } = require('../models');

class MemberDataAccess extends DataAccess {
  constructor() {
    super('members');
  }

  async getMemberById(memberId) {
    const member = await this.getByAny({
      propName: 'memberId',
      propValue: memberId,
    });
    return new Member(member);
  }
}

module.exports = new MemberDataAccess();
