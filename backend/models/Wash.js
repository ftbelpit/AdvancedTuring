const mongoose = require("mongoose");
const { Schema } = mongoose;

const washSchema = new Schema(
  {
    car: {
      fabricante: String,
      modelo: String,
      ano: String
    },
    washer: {
      name: String,
    },
    hour: String,
    date: String,
    washerId: mongoose.ObjectId,
    hourId: mongoose.ObjectId, // Novo campo para armazenar o ID da hora selecionada
    userId: mongoose.ObjectId,
    userName: String,
    washerPrice: String,
  },
  {
    timestamps: true,
  }
);

const Wash = mongoose.model('Wash', washSchema);

module.exports = Wash