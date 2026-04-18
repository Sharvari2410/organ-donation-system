const mongoose = require("mongoose");

// Donor details used for matching later
const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    organ: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate donor records for same exact details
donorSchema.index(
  { name: 1, age: 1, bloodGroup: 1, organ: 1, location: 1 },
  { unique: true }
);

module.exports = mongoose.model("Donor", donorSchema);
