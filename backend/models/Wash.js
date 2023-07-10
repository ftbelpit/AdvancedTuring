const mongoose = require("mongoose");
const { Schema } = mongoose;
const format = require("date-fns")
const ptBR = require("date-fns/locale")

const washSchema = new Schema(
  {
    car: {
      fabricante: String,
      modelo: String,
    },
    washer: {
      name: String,
    },
    washerId: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    userName: String,
    washerPrice: Number,
    day: String,
    hour: String
  },
  {
    timestamps: true,
  }
);

washSchema.methods.getFormattedDate = function () {
  const formattedDate = format(this.date, 'dd/MM/yyyy', { locale: ptBR });
  return formattedDate;
};

const Wash = mongoose.model('Wash', washSchema);

module.exports = Wash;

