const express = require("express")
const router = express.Router()

// Controller
const { 
  register, 
  login, 
  getCurrentUser,
  update,
  getUserById,
  getUsers
} = require("../controllers/UserController")

// Middlewares
const validate = require("../middlewares/handleValidation")
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations")
const authGuard = require("../middlewares/authGuard")
const authGuardAdmin = require("../middlewares/authGuardAdmin")

// Routes
router.post("/register", userCreateValidation(), validate, register)
router.post("/login", loginValidation(), validate, login)
router.get("/profile", authGuard, getCurrentUser)
router.put("/", authGuard, userUpdateValidation(), validate, update)
router.get("/", authGuardAdmin, getUsers)
router.get("/:id", getUserById)

module.exports = router