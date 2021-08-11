const express = require('express');
const {
  validateMemberReq,
  validateUpdateMemberReq,
  validateSearchReq,
  isMemberIdExists,
  validateEventAttendances,
} = require('../validators/member.validator');
const {
  memberController: {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
  },
} = require('../controllers');
const { checkRules } = require('../validators');

const router = express.Router();

router.get('/search', validateSearchReq, checkRules, searchMembers);
router.get('/', getAllMembers);
router.get('/:id', isMemberIdExists, getMemberById);
router.post('/', validateMemberReq, checkRules, createMember);
router.put(
  '/:id',
  validateUpdateMemberReq,
  checkRules,
  isMemberIdExists,
  updateMember
);
router.delete('/:id', isMemberIdExists, validateEventAttendances, deleteMember);

module.exports = router;
