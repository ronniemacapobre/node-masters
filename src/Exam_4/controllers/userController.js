const { userDataAccess } = require('../dataAccess');
const validator = require('email-validator');

const STATUS_CODE_OK = 200;
const STATUS_CODE_EMAIL_NOT_VALID = 400;
const STATUS_CODE_UPDATE_REQUEST_BODY_HAS_USERNAME = 400;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_USERNAME_EMAIL_ALREADY_EXISTS = 409;

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  const user = await userDataAccess.getUserByUsername(username);

  if (!user)
    res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`Username '${username}' does not exist`);

  res.status(STATUS_CODE_OK).send(user);
};

const getUserByEmailAddress = async (req, res) => {
  const emailAddress = req.params.emailAddress;
  const user = await userDataAccess.getUserByEmailAddress(emailAddress);

  if (!user)
    res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`Email Address '${emailAddress}' does not exist`);

  res.status(STATUS_CODE_OK).send(user);
};

const validateInsertUserRequest = async (req, res, next) => {
  const { username, emailAddress } = req.body;
  const isValid = validator.validate(emailAddress);

  if (!isValid)
    return res
      .status(STATUS_CODE_EMAIL_NOT_VALID)
      .send('Email Address is invalid');

  const userRes1 = await userDataAccess.getUserByUsername(username);
  const userRes2 = await userDataAccess.getUserByEmailAddress(emailAddress);

  if (userRes1 || userRes2)
    return res
      .status(STATUS_CODE_USERNAME_EMAIL_ALREADY_EXISTS)
      .send('Username/Email Address already exists');

  next();
};

const validateUpdateUserRequest = async (req, res, next) => {
  const { username } = req.params;
  let user = await userDataAccess.getUserByUsername(username);

  if (!user)
    return res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`Username '${username}' does not exist`);

  if (req.body.username !== undefined)
    return res
      .status(STATUS_CODE_UPDATE_REQUEST_BODY_HAS_USERNAME)
      .send(`Invalid request body`);

  if (req.body.emailAddress !== undefined) {
    const { emailAddress } = req.body;
    const isValid = validator.validate(emailAddress);

    if (!isValid)
      return res
        .status(STATUS_CODE_EMAIL_NOT_VALID)
        .send('Email Address is invalid');

    user = await userDataAccess.getUserByEmailAddress(emailAddress);
    if (user && user.username !== username)
      return res
        .status(STATUS_CODE_USERNAME_EMAIL_ALREADY_EXISTS)
        .send('Email Address already exists');
  }

  next();
};

const validateDeleteUserRequest = async (req, res, next) => {
  const username = req.params.username;
  const user = await userDataAccess.getUserByUsername(username);

  if (!user)
    return res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`Username '${username}' does not exist`);

  next();
};

const insertUser = async (req, res) => {
  const payload = req.body;

  const newUser = await userDataAccess.insertUser(payload);

  res.status(STATUS_CODE_OK).send(newUser);
};

const updateUser = async (req, res) => {
  const { username } = req.params;
  const payload = req.body;

  const user = await userDataAccess.getUserByUsername(username);

  await userDataAccess.updateUser(user.id, payload);

  res.status(STATUS_CODE_OK).send();
};

const deleteUser = async (req, res) => {
  const { username } = req.params;

  const user = await userDataAccess.getUserByUsername(username);

  await userDataAccess.deleteUser(user.id);

  res.status(STATUS_CODE_OK).send();
};

module.exports = {
  getUserByUsername,
  getUserByEmailAddress,
  validateInsertUserRequest,
  validateUpdateUserRequest,
  validateDeleteUserRequest,
  insertUser,
  updateUser,
  deleteUser,
};
