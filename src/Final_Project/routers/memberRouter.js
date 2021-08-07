const express = require('express');
const { createMemberValidation } = require('../validators/member.validator');
const {
  memberController: { getAllMembers, getMemberById, createMember },
} = require('../controllers');
const { checkRules } = require('../validators');

const router = express.Router();

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', createMemberValidation, checkRules, createMember);

module.exports = router;
