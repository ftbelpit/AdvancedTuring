const { body } = require("express-validator");
const moment = require("moment");
const Wash = require("../models/Wash");

const washInsertValidation = () => {
  return [
    body("fabricante")
      .isString()
      .withMessage("O fabricante é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O fabricante precisa ter no mínimo 2 caracteres."),
    body("modelo")
      .isString()
      .withMessage("O modelo é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O modelo precisa ter no mínimo 2 caracteres."),
    body("ano")
      .isNumeric()
      .withMessage("O ano deve ser numérico.")
      .isLength({ min: 4 })
      .withMessage("O ano precisa ter no mínimo 4 algarismos."),
    body("name")
      .isString()
      .withMessage("O nome do lavador é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O nome precisa ter no mínimo 2 caracteres."),
    body("date")
      .notEmpty()
      .withMessage("A data é obrigatória."),
    body("hour")
      .isString()
      .withMessage("O horário é obrigatório.")
      .isLength({ min: 5 })
      .withMessage("Insira o horário da lavagem.")
      .custom(async (value, { req }) => {
        const { washerId, date } = req.body;
        
        // Verificar se já existe uma lavagem com o mesmo horário e lavador
        const existingWash = await Wash.findOne({ washerId, date, hour: value });
        if (existingWash) {
          throw new Error("Já existe uma lavagem agendada com o mesmo horário e lavador.");
        }
        
        return true;
      })
      .custom((value) => {
        if (!moment(value, "HH:mm", true).isValid()) {
          throw new Error("O horário precisa estar no formato válido (HH:mm).");
        }
        return true;
      }),
  ];
};

module.exports = {
  washInsertValidation,
}