const express = require ("express")
const router = express.Router()

// Controller
const { 
  insertWasher, 
  deleteWasher, 
  getAllWashers, 
  getWasherById, 
  assessmentWasher
} = require("../controllers/WasherController")

// Middlewares
const { washerInsertValidation, commentValidation } = require("../middlewares/washerValidation")
const authGuardAdmin = require("../middlewares/authGuardAdmin")
const authGuard = require("../middlewares/authGuard")
const validate = require ("../middlewares/handleValidation")
const { imageUpload } = require("../middlewares/imageUpload")

// Routes 
router.post(
  "/", 
  authGuardAdmin, 
  imageUpload.single("image"),
  washerInsertValidation(), 
  validate, 
  insertWasher
)
router.delete("/:id", authGuardAdmin, deleteWasher)
router.get("/", getAllWashers)
router.get("/:id", getWasherById)
router.put("/assessments/:id", authGuard, commentValidation(), validate, assessmentWasher)

module.exports = router