const express = require("express");
const router = express.Router();

// Controller
const { 
  addTimeToWasher, 
  removeTimeFromWasher,
  getHoursWasher, 
} = require("../controllers/HoursWasherController");

// Middlewares
const { timesValidation } = require("../middlewares/hoursWasherValidation");
const authGuardAdmin = require("../middlewares/authGuardAdmin");
const validate = require("../middlewares/handleValidation");

// Rota para adicionar horário a um lavador
router.post(
  "/washer/:washerId",
  authGuardAdmin,
  timesValidation(),
  validate,
  addTimeToWasher
);

// Remover horário de um lavador
router.delete("/washer/:washerId", removeTimeFromWasher);

// Obter horários de um lavador
router.get("/washer/:washerId", getHoursWasher);

module.exports = router