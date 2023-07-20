const {body} = require("express-validator")

const washerInsertValidation = () => {
  return [ 
    body("image")
    .custom((value, { req }) => {
      if(!req.file) {
        throw new Error("A imagem é obrigatória")
      }
      return true
    }),
    body("name")
      .not()
      .equals("undefined")
      .withMessage("O nome é obrigatório.")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O nome precisa ter no minímo 2 caracteres."),
    body("price")
      .isString()
      .withMessage("O preço do lavador é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O preço deve ser de pelo menos 2 dígitos."),

  ]
}

const commentValidation = () => {
  return [
    body("score")
      .isFloat({ min: 0, max: 5 })
      .withMessage("A nota deve estar entre 0 e 5."),
    body("assessment")
      .optional()
      .isString()
      .withMessage("Avalie o lavador."),
  ];
};

module.exports = {
  washerInsertValidation,
  commentValidation
}