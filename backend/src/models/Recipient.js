const mongoose = require("mongoose");

// Recipient details used for matching later
const recipientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    requiredOrgan: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
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

// Prevent duplicate recipient records for same exact details
recipientSchema.index(
  { name: 1, age: 1, bloodGroup: 1, requiredOrgan: 1, urgency: 1 },
  { unique: true }
);

module.exports = mongoose.model("Recipient", recipientSchema);
