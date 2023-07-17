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
      .withMessage("O nome do lavador precisa ter no mínimo 2 caracteres."),
    body("date")
      .notEmpty()
      .withMessage("A data é obrigatória."),
    body("hour")
      .isString()
      .withMessage("O horário é obrigatório.")
      .isLength({ min: 5 })
      .withMessage("Insira o horário da lavagem.")
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