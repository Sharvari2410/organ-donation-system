const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const MatchRequest = require("../models/MatchRequest");

function areCompatible(donor, recipient) {
  return (
    donor.bloodGroup === recipient.bloodGroup &&
    String(donor.organ).toLowerCase() === String(recipient.requiredOrgan).toLowerCase()
  );
}

function buildContactQuery(email, phone) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").trim();

  if (!normalizedEmail && !normalizedPhone) {
    return null;
  }

  if (normalizedEmail && normalizedPhone) {
    return { email: normalizedEmail, phone: normalizedPhone };
  }

  if (normalizedEmail) return { email: normalizedEmail };
  return { phone: normalizedPhone };
}

const createMatchRequest = async (req, res) => {
  try {
    const { donorId, recipientId } = req.body;
    if (!donorId || !recipientId) {
      return res.status(400).json({ message: "donorId and recipientId are required" });
    }

    const [donor, recipient] = await Promise.all([Donor.findById(donorId), Recipient.findById(recipientId)]);
    if (!donor || !recipient) {
      return res.status(404).json({ message: "Donor or recipient not found" });
    }

    if (!areCompatible(donor, recipient)) {
      return res.status(400).json({ message: "Donor and recipient are not compatible" });
    }

    const existing = await MatchRequest.findOne({ donorId, recipientId });
    if (existing) {
      return res.status(409).json({ message: "Match request already exists for this pair", matchRequest: existing });
    }

    const matchRequest = await MatchRequest.create({
      donorId,
      recipientId,
      donorSnapshot: {
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        organ: donor.organ,
        location: donor.location,
        phone: donor.phone || "",
        email: donor.email || "",
      },
      recipientSnapshot: {
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
        urgency: recipient.urgency,
        phone: recipient.phone || "",
        email: recipient.email || "",
      },
      requestedByRole: req.userRole || "Volunteer",
      requestedByName: req.userName || "Unknown",
    });

    return res.status(201).json({ message: "Match request created", matchRequest });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Match request already exists for this donor-recipient pair",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: `Could not create match request: ${error.message}`,
      error: error.message,
    });
  }
};

const getMatchRequests = async (req, res) => {
  try {
    const status = String(req.query.status || "").trim();
    const filter = {};
    if (status) filter.status = status;

    const matchRequests = await MatchRequest.find(filter).sort({ createdAt: -1 });
    return res.json({ total: matchRequests.length, matchRequests });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch match requests", error: error.message });
  }
};

const reviewMatchRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be approved or rejected" });
    }

    const matchRequest = await MatchRequest.findById(id);
    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    matchRequest.status = status;
    matchRequest.reviewedByRole = req.userRole || "";
    matchRequest.reviewedByName = req.userName || "";
    await matchRequest.save();

    return res.json({ message: `Match request ${status}`, matchRequest });
  } catch (error) {
    return res.status(500).json({ message: "Could not review match request", error: error.message });
  }
};

const scheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentAt } = req.body;

    if (!appointmentAt) {
      return res.status(400).json({ message: "appointmentAt is required" });
    }

    const parsedDate = new Date(appointmentAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "appointmentAt must be a valid date/time" });
    }

    const matchRequest = await MatchRequest.findById(id);
    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    if (matchRequest.status !== "approved") {
      return res.status(400).json({ message: "Only approved requests can have appointments" });
    }

    matchRequest.appointmentAt = parsedDate;
    await matchRequest.save();

    return res.json({ message: "Appointment scheduled", matchRequest });
  } catch (error) {
    return res.status(500).json({ message: "Could not schedule appointment", error: error.message });
  }
};

const getRecipientSchedulesByContact = async (req, res) => {
  try {
    const contactQuery = buildContactQuery(req.query.email, req.query.phone);
    if (!contactQuery) {
      return res.status(400).json({ message: "Provide email or phone to view recipient appointments" });
    }

    const recipient = await Recipient.findOne(contactQuery);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found for provided contact details" });
    }

    const appointments = await MatchRequest.find({
      recipientId: recipient._id,
      status: "approved",
      appointmentAt: { $ne: null },
    }).sort({ appointmentAt: 1 });

    return res.json({
      recipient: {
        _id: recipient._id,
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
      },
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch recipient appointments", error: error.message });
  }
};

const getDonorSchedulesByContact = async (req, res) => {
  try {
    const contactQuery = buildContactQuery(req.query.email, req.query.phone);
    if (!contactQuery) {
      return res.status(400).json({ message: "Provide email or phone to view donor appointments" });
    }

    const donor = await Donor.findOne(contactQuery);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found for provided contact details" });
    }

    const appointments = await MatchRequest.find({
      donorId: donor._id,
      status: "approved",
      appointmentAt: { $ne: null },
    }).sort({ appointmentAt: 1 });

    return res.json({
      donor: {
        _id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        organ: donor.organ,
      },
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch donor appointments", error: error.message });
  }
};

module.exports = {
  createMatchRequest,
  getMatchRequests,
  reviewMatchRequest,
  scheduleAppointment,
  getRecipientSchedulesByContact,
  getDonorSchedulesByContact,
};
