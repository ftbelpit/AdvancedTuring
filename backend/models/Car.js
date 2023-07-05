const mongoose = require("mongoose")
const {Schema} = mongoose

const carSchema = new Schema(
  {
    fabricante: String,
    modelo: String, 
    ano: Number,
    userId: mongoose.ObjectId,
    userName: String,
  },
  {
    timestamps: true
  }
)

const Car = mongoose.model("Car", carSchema);

module.exports = Car;