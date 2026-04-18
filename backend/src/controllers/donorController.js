const Donor = require("../models/Donor");

// Create a new donor
const createDonor = async (req, res) => {
  try {
    const existingDonor = await Donor.findOne({
      name: req.body.name,
      age: req.body.age,
      bloodGroup: req.body.bloodGroup,
      organ: req.body.organ,
      location: req.body.location,
    });

    if (existingDonor) {
      return res.status(409).json({
        message: "Donor already exists with same details",
      });
    }

    const donor = await Donor.create(req.body);
    return res.status(201).json(donor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Donor already exists with same details",
      });
    }

    return res.status(400).json({
      message: "Could not create donor",
      error: error.message,
    });
  }
};

// Get all donors
const getDonors = async (req, res) => {
  try {
    const { organ, bloodGroup, city, ageMin, ageMax } = req.query;
    const query = {};

    if (organ) query.organ = new RegExp(`^${String(organ).trim()}$`, "i");
    if (bloodGroup) query.bloodGroup = String(bloodGroup).trim();
    if (city) query.location = new RegExp(String(city).trim(), "i");

    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });
    return res.json(donors);
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch donors",
      error: error.message,
    });
  }
};

module.exports = {
  createDonor,
  getDonors,
};
