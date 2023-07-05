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
    body("date")
      .isDate()
      .withMessage("A data é obrigatória.")
      .isLength()
      .withMessage("Insira a data da lavagem."),
  ] 
}

module.exports = {
  washInsertValidation,
}