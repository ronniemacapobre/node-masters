const express = require('express');

const {
  memberController: { getAllMembers, getMemberById },
} = require('../controllers');

const router = express.Router();

router.get('/', getAllMembers);
router.get('/:id', getMemberById);

module.exports = router;
