const mongoose = require("mongoose");
const { Schema } = mongoose;

const hoursWasher = new Schema(
  {
    washerId: mongoose.ObjectId,
    hour: String
  },
  {
    timestamps: true,
  }
);

const HoursWasher = mongoose.model("HoursWasher", hoursWasher);

module.exports = HoursWasher;