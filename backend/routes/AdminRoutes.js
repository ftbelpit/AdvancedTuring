const express = require("express")
const router = express.Router()

// Controller
const { 
  registerAdmin, 
  loginAdmin, 
  getCurrentAdmin,
  updateAdmin,
  getAdminById,
} = require("../controllers/AdminController")

// Middlewares
const validate = require("../middlewares/handleValidation")
const {
  adminCreateValidation,
  adminLoginValidation,
  adminUpdateValidation,
} = require("../middlewares/adminValidations")
const authGuardAdmin = require("../middlewares/authGuardAdmin")

// Routes
router.post("/register_admin", adminCreateValidation(), validate, registerAdmin)
router.post("/login_admin", adminLoginValidation(), validate, loginAdmin)
router.get("/profile_admin", authGuardAdmin, getCurrentAdmin)
router.put("/", authGuardAdmin, adminUpdateValidation(), validate, updateAdmin)
router.get("/:id_admin", getAdminById)

module.exports = router