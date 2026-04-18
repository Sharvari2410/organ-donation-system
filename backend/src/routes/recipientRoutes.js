const express = require("express");
const {
  createRecipient,
  getRecipients,
} = require("../controllers/recipientController");

const router = express.Router();

router.post("/", createRecipient);
router.get("/", getRecipients);

module.exports = router;
