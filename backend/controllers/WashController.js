const User = require("../models/User");
const Car = require("../models/Car");
const Washer = require("../models/Washer");
const Wash = require("../models/Wash");

const mongoose = require("mongoose");

// Inserir uma lavagem associada a um carro existente
const insertWash = async (req, res) => {
  const { fabricante, modelo, washerId, date, hour } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    // Encontra o carro existente no banco de dados
    const car = await Car.findOne({
      fabricante: { $regex: new RegExp(fabricante, "i") },
      modelo: { $regex: new RegExp(modelo, "i") }
    });
    
    const washer = await Washer.findById(washerId);

    if (!car) {
      return res.status(404).json({ errors: ["Carro não encontrado."] });
    }

    if (!washer) {
      return res.status(404).json({ errors: ["Lavador não encontrado."] });
    }

    // Verifica se o horário está disponível para o lavador
    const availableHour = washer.times.find((time) => time.hour === hour);
    if (!availableHour) {
      return res.status(409).json({ errors: ["O horário selecionado não está disponível para o lavador."] });
    }

    // Verifica se já existe uma lavagem com a mesma data, hora e lavador
    const existingWash = await Wash.findOne({
      washerId,
      date,
      hour
    });

    if (existingWash) {
      return res.status(409).json({ errors: ["Já existe uma lavagem agendada com a mesma data, hora e lavador."] });
    }

    // Cria uma nova lavagem associada ao carro existente
    const newWash = await Wash.create({
      car: {
        fabricante: car.fabricante,
        modelo: car.modelo,
        ano: car.ano
      },
      washer: {
        name: washer.name
      },
      washerId: washer._id,
      userId: user._id,
      userName: user.name,
      washerPrice: washer.price,
      date,
      hour
    });

    // Se a lavagem for criada com sucesso, retorna os dados
    return res.status(201).json(newWash);
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."]
    });
  }
}

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