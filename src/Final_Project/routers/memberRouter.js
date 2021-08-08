const express = require('express');
const { body } = require('express-validator');
const {
  upsertMemberValidation,
  searchParamValidation,
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

router.get('/search', searchParamValidation, checkRules, searchMembers);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', upsertMemberValidation, checkRules, createMember);
router.put(
  '/:id',
  body('memberId')
    .exists()
    .withMessage('Member Id is required')
    .notEmpty()
    .withMessage('Member Id is required'),
  upsertMemberValidation,
  checkRules,
  updateMember
);
router.delete('/:id', deleteMember);

module.exports = router;
