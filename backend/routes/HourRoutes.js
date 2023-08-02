const express = require("express");
const router = express.Router();

// Controller
const { 
  insertHour, 
  deleteHour, 
  getHours,
  getAvailableHours
} = require("../controllers/HourController");

// Middlewares
const { hoursValidation } = require("../middlewares/hoursValidation");
const authGuardAdmin = require("../middlewares/authGuardAdmin");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");

// Rota para adicionar horário a um lavador
router.post(
  "/washer/:washerId",
  authGuardAdmin,
  hoursValidation(),
  validate,
  insertHour
);

// Remover horário de um lavador
router.delete("/washer/:id", authGuardAdmin, deleteHour);

// Obter horários de um lavador
router.get("/washer/:washerId", getHours);

router.get("/washer/available-hours/:washerId/:date", getAvailableHours);

module.exports = router