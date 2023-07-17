const mongoose = require("mongoose");
const { Schema } = mongoose;

const washerSchema = new Schema(
  {
    image: String,
    name: String,
    assessments: Array,
    price: String,
    adminId: mongoose.ObjectId,
    adminName: String,
    hour: Array
  },
  {
    timestamps: true,
  }
);


const Washer = mongoose.model("Washer", washerSchema);

module.exports = Washer;