const Washer = require("../models/Washer")
const Admin = require("../models/Admin")
const User = require("../models/User")

const mongoose = require("mongoose")

// Insert a washer
const insertWasher = async(req, res) => {
  const { name, price } = req.body
  const image = req.file.filename

  const reqAdmin = req.admin

  const admin = await Admin.findById(reqAdmin._id)

  // Create a washer
  const newWasher = await Washer.create({
    image,
    name,
    price,
    adminId: admin._id,
    adminName: admin.name_admin
  })

  // If washer was created successfully, return data
  if(!newWasher) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."], 
    })
    return
  }

  res.status(201).json(newWasher)
}

// Remove a photo from DB
const deleteWasher = async(req, res) => {
  const {id} = req.params 

  const reqAdmin = req.admin 
  try {
    const washer = await Washer.findById(new mongoose.Types.ObjectId(id))

    // Check if photo exists
    if(!washer) {
      res.status(404).json({ errors: ["Foto não encontrada!"] })
      return
    }

    // Check if photo belongs to user
    if(!washer.adminId.equals(reqAdmin._id)) {
      res
        .status(422)
        .json({ 
          errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]
        })
    }

    await Washer.findByIdAndDelete(washer._id)

    res
      .status(200)
      .json({ 
        id: Washer._id, message: "Lavador excluído com sucesso com sucesso." 
      })
  } catch (error) {
      res.status(404).json({ errors: ["Foto não encontrada!"] })
      return
  }
}

// Get all washers
const getAllWashers = async(req, res) => {
  const washers = await Washer.find({})
    .sort([["createdAt", -1]])
    .exec()

  return res.status(200).json(washers)
}

// Get washer by id
const getWasherById = async (req, res) => {
  const {id} = req.params

  const washer = await Washer.findById(new mongoose.Types.ObjectId(id))

  // Check if washer exists
  if(!washer) {
    res.status(404).json({ errors: ["Washer não encontrado."]})
    return
  }

  res.status(200).json(washer)
}

// Assessments functionality
const assessmentWasher = async (req, res) => {
  const { id } = req.params;
  const { score, assessment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const washer = await Washer.findById(id);

  if (!washer) {
    res.status(404).json({ errors: ["Lavador não encontrado"] });
    return;
  }

  const userAvalition = {
    score,
    assessment,
    userName: user.name,
    userId: user._id,
  };

  washer.assessments.push(userAvalition);

  await washer.save();

  res.status(200).json({
    assessment: userAvalition,
    message: "Avaliação foi adicionada com sucesso!",
  });
};

module.exports = {
  insertWasher,
  deleteWasher,
  getAllWashers,
  getWasherById,
  assessmentWasher,
}