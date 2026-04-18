const express = require("express");
const {
  createMatchRequest,
  getMatchRequests,
  reviewMatchRequest,
  scheduleAppointment,
  getRecipientSchedulesByContact,
  getDonorSchedulesByContact,
} = require("../controllers/matchRequestController");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireRole(["Admin"]), getMatchRequests);
router.post("/", requireRole(["Admin"]), createMatchRequest);
router.patch("/:id/review", requireRole(["Admin"]), reviewMatchRequest);
router.patch("/:id/appointment", requireRole(["Admin"]), scheduleAppointment);
router.get("/recipient/schedule", requireRole(["Admin", "Recipient", "Donor"]), getRecipientSchedulesByContact);
router.get("/donor/schedule", requireRole(["Admin", "Recipient", "Donor"]), getDonorSchedulesByContact);

module.exports = router;
