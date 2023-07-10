const {body} = require("express-validator")

const washInsertValidation = () => {
  return [
    body("fabricante")
      .isString()
      .withMessage("O fabricante é obrigatório.")
      .isLength({min: 2})
      .withMessage("O fabricante precisa ter no mínimo 2 caracteres."),
    body("modelo")
      .isString()
      .withMessage("O modelo é obrigatório.")
      .isLength({min: 2})
      .withMessage("O modelo precisa ter no mínimo 2 caracteres."),
    body("name")
      .isString()
      .withMessage("O nome do lavador é obrigatório.")
      .isLength({min: 2})
      .withMessage("O nome precisa ter no mínimo 2 caracteres."),
    body("day")
      .isString()
      .withMessage("O dia é obrigatório")
      .isLength()
      .withMessage("Insira o dia da lavagem."),
    body("hour")
      .isString()
      .withMessage("O horário é obrigatório.")
      .isLength()
      .withMessage("Insira o horário da lavagem."),
  ] 
}

module.exports = {
  washInsertValidation,
}