const User = require("../models/User")
const Car = require("../models/Car")

const mongoose = require("mongoose")

// Insert a car, with an user related to it
const insertCar = async (req, res) => {
  const { fabricante, modelo, ano } = req.body;

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    // Create a car
    const newCar = await Car.create({
      fabricante,
      modelo,
      ano,
      userId: user._id,
      userName: user.name
    });

    // If car was created successfully, return data
    res.status(201).json(newCar);
  } catch (error) {
    console.log(error);
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."]
    });
  }
};

// Remove a car from DB
const deleteCar = async(req, res) => {
  const {id} = req.params 

  const reqUser = req.user 
  try {
    const car = await Car.findById(new mongoose.Types.ObjectId(id))

    // Check if car exists
    if(!car) {
      res.status(404).json({ errors: ["Carro não encontrado!"] })
      return
    }

    // Check if car belongs to user
    if(!car.userId.equals(reqUser._id)) {
      return res
        .status(422)
        .json({ 
          errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]
        })
    }

    await Car.findByIdAndDelete(car._id)

    res
      .status(200)
      .json({ 
        id: car._id, message: "Carro excluído com sucesso." 
      })
  } catch (error) {
      res.status(404).json({ errors: ["Carro não encontrado!"] })
      return
  }
}

// Get all cars
const getAllCars = async(req, res) => {
  const cars = await Car.find({})
    .sort([["createdAt", -1]])
    .exec()

  return res.status(200).json(cars)
}

const getUserCars = async(req, res) => {
  const {id} = req.params

  const cars = await Car.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec()

    return res.status(200).json(cars)
}

// Get car by id
const getCarById = async (req, res) => {
  const {id} = req.params

  const car = await Car.findById(new mongoose.Types.ObjectId(id))

  // Check if car exists
  if(!car) {
    res.status(404).json({ errors: ["Carro não encontrado."]})
    return
  }

  res.status(200).json(car)
}

// Update a car
const updateCar = async(req, res) => {
  const {id} = req.params
  const {fabricante} = req.body
  const {modelo} = req.body
  const {ano} = req.body

  const reqUser = req.user

  const car = await Car.findById(id)

  // Check if car exists
  if(!car) {
    res.status(404).json({errors: ["Carro não encontrado"]})
    return
  }

  // Check if car belongs to user
  if(!car.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]
      })
    return
  }

  if(fabricante) {
    car.fabricante = fabricante
  }
  if(modelo) {
    car.modelo = modelo
  }
  if(ano) {
    car.ano = ano
  }

  await car.save()

  res.status(200).json({ car, message: "Carro atualizado com sucesso!" })
}

module.exports = {
  insertCar,
  deleteCar,
  getAllCars,
  getUserCars,
  getCarById,
  updateCar
}