const User = require("../models/User");
const Car = require("../models/Car");
const Washer = require("../models/Washer");
const Wash = require("../models/Wash");
const Admin = require("../models/Admin")

const mongoose = require("mongoose");

// Inserir uma lavagem associada a um carro existente
const insertWash = async (req, res) => {
  const { fabricante, modelo, name, day, hour } = req.body;

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    // Encontra o carro existente no banco de dados
    const car = await Car.findOne({
      fabricante: { $regex: new RegExp(fabricante, "i") },
      modelo: { $regex: new RegExp(modelo, "i") }
    });
    
    const washer = await Washer.findOne({
      name: { $regex: new RegExp(name, "i") }
    });    

    if (!car) {
      return res.status(404).json({ errors: ["Carro não encontrado."] });
    }

    if (!washer) {
      return res.status(404).json({ errors: ["Lavador não encontrado."] });
    }

    // Cria uma nova lavagem associada ao carro existente
    const newWash = await Wash.create({
      car: {
        fabricante: car.fabricante,
        modelo: car.modelo
      },
      washer: {
        name: washer.name
      },
      washerId: washer._id,
      userId: user._id,
      userName: user.name,
      washerPrice: washer.price,
      day,
      hour
    });

    // Se a lavagem for criada com sucesso, retorna os dados
    res.status(201).json(newWash)
  } catch (error) {
    console.log(error);
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."]
    });
  }
};

const deleteWash = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  const reqAdmin = req.admin;

  try {
    const wash = await Wash.findOne({ _id: id });

    // Check if wash exists
    if (!wash) {
      return res.status(404).json({ errors: ["Lavagem não encontrada!"] });
    }

    // Check if wash belongs to user
    if (reqUser && !wash.userId.equals(reqUser._id) && !reqAdmin) {
      return res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    await Wash.findOneAndDelete({ _id: id });

    res.status(200).json({
      id: wash._id,
      message: "Lavagem desmarcada com sucesso.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: ["Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."],
    });
  }
};

// Get all washes
const getAllWashes = async(req, res) => {
  const washes = await Wash.find({})
    .sort([["createdAt", -1]])
    .exec()

  return res.status(200).json(washes)
}

const getUserWashes = async(req, res) => {
  const {id} = req.params

  const washes = await Wash.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec()

    return res.status(200).json(washes)
}

const getWasherWashes = async(req, res) => {
  const {id} = req.params

  const washes = await Wash.find({ washerId: id })
    .sort([["createdAt", -1]])
    .exec()

    return res.status(200).json(washes)
}

// Get wash by id
const getWashById = async (req, res) => {
  const {id} = req.params

  const wash = await Wash.findById(new mongoose.Types.ObjectId(id))

  // Check if wash exists
  if(!wash) {
    res.status(404).json({ errors: ["Lavagem não encontrada."]})
    return
  }

  res.status(200).json(wash)
}

module.exports = {
  insertWash,
  deleteWash,
  getAllWashes,
  getUserWashes,
  getWasherWashes,
  getWashById,
}