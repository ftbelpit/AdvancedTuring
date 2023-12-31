const express = require("express");
const router = express.Router();

// Controller
const { 
  insertWash, 
  deleteWash, 
  getAllWashes,
  getUserWashes,
  getWasherWashes, 
  getWashById
} = require("../controllers/WashController");

// Middlewares
const { washInsertValidation } = require("../middlewares/washValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const authGuardAdmin = require("../middlewares/authGuardAdmin");

// Routes
router.post("/", authGuard, washInsertValidation(), validate, insertWash);
router.delete("/:id", deleteWash);
router.get("/", authGuardAdmin, getAllWashes);
router.get("/user/:id", authGuard, getUserWashes);
router.get("/washer/:id", getWasherWashes);
router.get("/:id", authGuard, getWashById);

module.exports = router