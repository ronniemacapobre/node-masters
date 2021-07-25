const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const dbAsync = lowdb(new FileAsync(path.join(__dirname, 'db.json')));
const { v4: uuid } = require('uuid');

class DataAccess {
  constructor(tableName, tableIdFieldName) {
    this.tableName = tableName;
    this.tableIdFieldName = tableIdFieldName;
    this.dbContext = dbAsync.then((db) => {
      db.defaults({ [tableName]: [] }).write();
      return db;
    });
  }

  async getAll() {
    const dbContext = await this.dbContext;

    return dbContext.get(this.tableName).value();
  }

  async getById(id) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .find({ [this.tableIdFieldName]: id })
      .value();
  }

  async getByAny({ propName, propValue }) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .find({ [propName]: propValue })
      .value();
  }

  async filterByAny({ propName, propValue }) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .filter((e) => e[propName] === propValue)
      .value();
  }

  async create(data) {
    const dbContext = await this.dbContext;
    const id = uuid();

    dbContext
      .get(this.tableName)
      .push({
        [this.tableIdFieldName]: id,
        ...data,
      })
      .write();

    return this.getById(id);
  }

  async update(id, data) {
    const dbContext = await this.dbContext;

    dbContext.get(this.tableName).find({ id }).assign(data).write();
  }

  async delete(id) {
    const dbContext = await this.dbContext;

    dbContext
      .get(this.tableName)
      .remove({ [this.tableIdFieldName]: id })
      .write();
  }
}

module.exports = DataAccess;
