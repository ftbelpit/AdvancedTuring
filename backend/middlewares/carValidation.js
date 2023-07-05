const {body} = require("express-validator")

const carInsertValidation = () => {
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
    body("ano")
      .isNumeric()
      .withMessage("O ano deve ser númerico.")
      .isLength({ min: 4 })
      .withMessage("O ano precisa ter no mínimo 4 algarismos."),
  ] 
}

const carUpdateValidation = () => {
  return [
    body("fabricante")
      .optional()
      .isLength({min: 2})
      .withMessage("O fabricante precisa ter no mínimo 2 caracteres."),
    body("modelo")
      .optional()
      .isLength({ min:2 })
      .withMessage("O modelo precisa ter no mínimo 2 caracteres."),
    body("ano")
      .optional()
      .isLength({ min: 4 })
      .withMessage("O ano precisa ter no mínimo 4 algarismos."),
  ]
}

module.exports = {
  carInsertValidation,
  carUpdateValidation,
}