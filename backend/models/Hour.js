const mongoose = require("mongoose");
const { Schema } = mongoose;

const hourSchema = new Schema(
  {
    washerId: mongoose.ObjectId,
    hour: String
  },
  {
    timestamps: true,
  }
);

const Hour = mongoose.model("Hour", hourSchema);

module.exports = Hour;