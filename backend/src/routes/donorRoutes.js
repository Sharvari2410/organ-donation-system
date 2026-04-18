const express = require("express");
const { createDonor, getDonors } = require("../controllers/donorController");

const router = express.Router();

router.post("/", createDonor);
router.get("/", getDonors);

module.exports = router;
