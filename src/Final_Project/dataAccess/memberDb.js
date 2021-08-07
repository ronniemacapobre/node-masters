const DataAccess = require('./db');
const { Member } = require('../models');

class MemberDataAccess extends DataAccess {
  constructor() {
    super('members', 'memberId');
  }

  async getMemberById(memberId) {
    const member = await this.getById(memberId);
    return member ? new Member(member) : null;
  }

  async getAllMembers() {
    const data = await this.getAll();
    const members = data.map((member) => new Member(member));
    return members;
  }

  async createMember(data) {
    const member = await this.create(data);
    return new Member(member);
  }
}

module.exports = new MemberDataAccess();
