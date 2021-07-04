const express = require('express');
const {
  userController: {
    getUserByUsername,
    getUserByEmailAddress,
    validateInsertUserRequest,
    insertUser,
    validateUpdateUserRequest,
    updateUser,
    validateDeleteUserRequest,
    deleteUser,
  },
} = require('../controllers');

const router = express.Router();

router.get('/user/:username', getUserByUsername);
router.get('/user/email/:emailAddress', getUserByEmailAddress);
router.post('/', validateInsertUserRequest, insertUser);
router.put('/user/:username', validateUpdateUserRequest, updateUser);
router.delete('/user/:username', validateDeleteUserRequest, deleteUser);

module.exports = router;
