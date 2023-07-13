const mongoose = require("mongoose");
const { Schema } = mongoose;
const format = require("date-fns");
const ptBR = require("date-fns/locale");

const washSchema = new Schema(
  {
    car: {
      fabricante: String,
      modelo: String,
      ano: Number
    },
    washer: {
      name: String,
    },
    washerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Washer' // Assuming 'User' is the model name for the washer
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Assuming 'User' is the model name for the user
    },
    userName: String,
    washerPrice: Number,
    date: {
      type: Date,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

washSchema.index({ date: 1, hour: 1, washerId: 1 }, { unique: true });

washSchema.methods.getFormattedDate = function () {
  const formattedDate = format(this.date, 'dd/MM/yyyy', { locale: ptBR });
  return formattedDate;
};

const Wash = mongoose.model('Wash', washSchema);

module.exports = Wash;