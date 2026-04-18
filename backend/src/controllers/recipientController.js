const Recipient = require("../models/Recipient");

// Create a new recipient
const createRecipient = async (req, res) => {
  try {
    const existingRecipient = await Recipient.findOne({
      name: req.body.name,
      age: req.body.age,
      bloodGroup: req.body.bloodGroup,
      requiredOrgan: req.body.requiredOrgan,
      urgency: req.body.urgency,
    });

    if (existingRecipient) {
      return res.status(409).json({
        message: "Recipient already exists with same details",
      });
    }

    const recipient = await Recipient.create(req.body);
    return res.status(201).json(recipient);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Recipient already exists with same details",
      });
    }

    return res.status(400).json({
      message: "Could not create recipient",
      error: error.message,
    });
  }
};

// Get all recipients
const getRecipients = async (req, res) => {
  try {
    const { requiredOrgan, bloodGroup, urgency, ageMin, ageMax } = req.query;
    const query = {};

    if (requiredOrgan) query.requiredOrgan = new RegExp(`^${String(requiredOrgan).trim()}$`, "i");
    if (bloodGroup) query.bloodGroup = String(bloodGroup).trim();
    if (urgency) query.urgency = String(urgency).trim();

    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    const recipients = await Recipient.find(query).sort({ createdAt: -1 });
    return res.json(recipients);
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch recipients",
      error: error.message,
    });
  }
};

module.exports = {
  createRecipient,
  getRecipients,
};
