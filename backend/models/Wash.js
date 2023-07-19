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
      hour: String
    },
    washerId: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    userName: String,
    washerPrice: String,
    date: {
      type: Date,
      default: Date.now,
    },
    
  },
  {
    timestamps: true,
  }
);

washSchema.methods.checkDuplicate = async function () {
  const existingWash = await mongoose.model('Wash').findOne({
    washerId: this.washerId,
    date: this.date,
    'washer.hour': this.washer.hour
  });

  return !!existingWash;
};

const Wash = mongoose.model('Wash', washSchema)