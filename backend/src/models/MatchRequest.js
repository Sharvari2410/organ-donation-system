const mongoose = require("mongoose");

const matchRequestSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
      required: true,
    },
    donorSnapshot: {
      name: { type: String, required: true },
      bloodGroup: { type: String, required: true },
      organ: { type: String, required: true },
      location: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    recipientSnapshot: {
      name: { type: String, required: true },
      bloodGroup: { type: String, required: true },
      requiredOrgan: { type: String, required: true },
      urgency: { type: String, required: true },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    requestedByRole: {
      type: String,
      default: "Volunteer",
    },
    requestedByName: {
      type: String,
      default: "Unknown",
    },
    reviewedByRole: {
      type: String,
      default: "",
    },
    reviewedByName: {
      type: String,
      default: "",
    },
    appointmentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

matchRequestSchema.index({ donorId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model("MatchRequest", matchRequestSchema);
