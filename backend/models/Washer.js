const mongoose = require("mongoose");
const { Schema } = mongoose;

const washerSchema = new Schema(
  {
    image: String,
    name: String,
    assessments: Array,
    price: Number,
    adminId: mongoose.ObjectId,
    adminName: String,
  },
  {
    timestamps: true,
  }
);

const Washer = mongoose.model("Washer", washerSchema);

module.exports = Washer;