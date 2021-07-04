const DataAccess = require('./db');

class UserDataAccess extends DataAccess {
  constructor() {
    super('users');
  }

  async getUserByUsername(username) {
    const user = await this.getByAny({
      propName: 'username',
      propValue: username,
    });
    return user;
  }

  async getUserByEmailAddress(emailAddress) {
    const user = await this.getByAny({
      propName: 'emailAddress',
      propValue: emailAddress,
    });
    return user;
  }

  async insertUser(user) {
    const newUser = await this.insert(user);
    return newUser;
  }

  async updateUser(userId, user) {
    await this.update(userId, user);
  }

  async deleteUser(userId) {
    await this.delete(userId);
  }
}

module.exports = new UserDataAccess();
