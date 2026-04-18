const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const { findMatches } = require("../utils/matchLogic");

// Get all donor-recipient matches
const getMatches = async (req, res) => {
  try {
    const donors = await Donor.find();
    const recipients = await Recipient.find().sort({ urgency: -1, createdAt: -1 });

    const matches = findMatches(donors, recipients);

    return res.json({
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not generate matches",
      error: error.message,
    });
  }
};

// Get matches for one specific recipient so they can view donor contacts.
const getRecipientMatches = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const recipient = await Recipient.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    const donors = await Donor.find().sort({ createdAt: -1 });
    const rawMatches = findMatches(donors, [recipient]);

    const matches = rawMatches.map((match) => ({
      donor: {
        _id: match.donor._id,
        name: match.donor.name,
        bloodGroup: match.donor.bloodGroup,
        organ: match.donor.organ,
        location: match.donor.location,
        phone: match.donor.phone || "",
        email: match.donor.email || "",
      },
      recipient: {
        _id: recipient._id,
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
        urgency: recipient.urgency,
      },
    }));

    return res.json({
      recipient: {
        _id: recipient._id,
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
        urgency: recipient.urgency,
      },
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch recipient matches",
      error: error.message,
    });
  }
};

// Find recipient by email/phone and return their donor matches.
const getRecipientMatchesByContact = async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    const phone = String(req.query.phone || "").trim();

    if (!email && !phone) {
      return res.status(400).json({
        message: "Provide email or phone to find recipient matches",
      });
    }

    const query = {};
    if (email && phone) {
      query.email = email;
      query.phone = phone;
    } else if (email) {
      query.email = email;
    } else {
      query.phone = phone;
    }

    const recipient = await Recipient.findOne(query);

    if (!recipient) {
      return res.status(404).json({
        message: "No recipient found for the provided contact details",
      });
    }

    const donors = await Donor.find().sort({ createdAt: -1 });
    const rawMatches = findMatches(donors, [recipient]);

    const matches = rawMatches.map((match) => ({
      donor: {
        _id: match.donor._id,
        name: match.donor.name,
        bloodGroup: match.donor.bloodGroup,
        organ: match.donor.organ,
        location: match.donor.location,
        phone: match.donor.phone || "",
        email: match.donor.email || "",
      },
      recipient: {
        _id: recipient._id,
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
        urgency: recipient.urgency,
        phone: recipient.phone || "",
        email: recipient.email || "",
      },
    }));

    return res.json({
      recipient: {
        _id: recipient._id,
        name: recipient.name,
        bloodGroup: recipient.bloodGroup,
        requiredOrgan: recipient.requiredOrgan,
        urgency: recipient.urgency,
        phone: recipient.phone || "",
        email: recipient.email || "",
      },
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch recipient matches",
      error: error.message,
    });
  }
};

// Admin dashboard summary: counts + recent data + match count
const getAdminSummary = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    const recipients = await Recipient.find().sort({ createdAt: -1 });

    const matches = findMatches(donors, recipients);

    return res.json({
      totalDonors: donors.length,
      totalRecipients: recipients.length,
      totalMatches: matches.length,
      recentDonors: donors.slice(0, 5),
      recentRecipients: recipients.slice(0, 5),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not load admin summary",
      error: error.message,
    });
  }
};

module.exports = {
  getMatches,
  getRecipientMatches,
  getRecipientMatchesByContact,
  getAdminSummary,
};
