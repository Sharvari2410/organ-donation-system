const express = require("express");
const {
  getMatches,
  getRecipientMatches,
  getRecipientMatchesByContact,
  getAdminSummary,
} = require("../controllers/matchController");

const router = express.Router();

router.get("/", getMatches);
router.get("/recipient/search", getRecipientMatchesByContact);
router.get("/recipient/:recipientId", getRecipientMatches);
router.get("/admin-summary", getAdminSummary);

module.exports = router;
