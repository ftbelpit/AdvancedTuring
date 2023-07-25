const express = require("express");
const router = express.Router();

// Controller
const { 
  insertHour, 
  deleteHour, 
  getHours
} = require("../controllers/HoursController");

// Middlewares
const { hoursValidation } = require("../middlewares/hoursValidation");
const authGuardAdmin = require("../middlewares/authGuardAdmin");
const validate = require("../middlewares/handleValidation");

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


module.exports = router