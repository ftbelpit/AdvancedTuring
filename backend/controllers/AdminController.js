const Admin = require("../models/Admin")

const bcrypt1 = require("bcryptjs")
const jwt1 = require("jsonwebtoken")

const mongoose = require("mongoose")

const jwtSecret1 = process.env.JWT_SECRET1

// Generate admin token
const generateTokenAdmin = (id_admin) => {
  return jwt1.sign({ id_admin }, jwtSecret1, {
    expiresIn: "7d",
  })
}

// Register admin and sign in
const registerAdmin = async (req,res) => {
  const {name_admin, email_admin, password_admin} = req.body

  // check if admin exists
  const admin = await Admin.findOne({email_admin})

  if(admin) {
    res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
    return
  }

  // Generate password has
  const salt_admin = await bcrypt1.genSalt()
  const passwordHash_admin = await bcrypt1.hash(password_admin, salt_admin)

  // Create admin
  const newAdmin = await Admin.create({
    name_admin,
    email_admin,
    password_admin: passwordHash_admin
  })

  // If admin was created successfully, return the token
  if(!newAdmin) {
    res.status(422).json({errors: ["Houve um erro, por favor tente novamente mais tarde."]})
    return
  }

  res.status(201).json({
    _id: newAdmin._id,
    token_admin: generateTokenAdmin(newAdmin._id)
  })
 
}

// Sign admin in
const loginAdmin = async (req, res) => {

  const {email_admin, password_admin} = req.body

  const admin = await Admin.findOne({email_admin})

  // Check if admin exists
  if(!admin) {
    res.status(404).json({errors: ["Administrador não encontrado."]})
    return
  }

  // Check if password matches
  if(!(await bcrypt1.compare(password_admin, admin.password_admin))) {
    res.status(422).json({ errors: ["Senha inválida"]})
    return
  }

  // Return admin with token
  res.status(201).json({
    _id: admin._id,
    token_admin: generateTokenAdmin(admin._id)
  })

}

// Get current logged in admin
const getCurrentAdmin = async (req,res) => {
  const admin = req.admin

  res.status(200).json(admin)
}

// Update an admin
const updateAdmin = async (req, res) => {
  const {name_admin, password_admin} = req.body

  const reqAdmin = req.admin

  const admin = await Admin.findById(new mongoose.Types.ObjectId(reqAdmin._id)).select("-password_admin")

  if(name_admin) {
    admin.name_admin = name_admin
  }

  if(password_admin) {
    // Generate password has
    const salt_admin = await bcrypt1.genSalt()
    const passwordHash_admin = await bcrypt1.hash(password_admin, salt_admin)

    admin.password_admin = passwordHash_admin
  }

  await admin.save()

  res.status(200).json(admin)
}

// Get admin by id
const getAdminById = async (req,res) => {
  const {id_admin} = req.params

  try {
    const admin = await Admin.findById(new mongoose.Types.ObjectId(id_admin)).select("-password_admin")

    //  Check if admin exists 
    if(!admin) {
      res.status(404).json({ errors: ["Administrador não encontrado."] })
      return
    }

    res.status(200).json(admin)
  } catch (error) {
    res.status(404).json({ errors: ["Administrador não encontrado."] })
    return
  }
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  updateAdmin,
  getAdminById,
}