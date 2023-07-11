const {body} = require("express-validator")
const moment = require('moment');

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

const timesValidation = () => {
  return [
    body("hour")
      .custom((value) => {
        if (!Array.isArray(value)) {
          value = [value]; // Transforma em um array caso não seja
        }

        const validHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

        const invalidHours = value.filter((hour) => {
          // Verifica se a hora não está no padrão estabelecido ou se está repetida
          return !validHours.includes(hour) || value.indexOf(hour) !== value.lastIndexOf(hour);
        });

        if (invalidHours.length > 0) {
          throw new Error(`Horas inválidas: ${invalidHours.join(", ")}`);
        }
        return true;
      })
      .withMessage("As horas são obrigatórias, devem estar no padrão estabelecido e não podem ser repetidas.")
  ];
};

module.exports = {
  washerInsertValidation,
  commentValidation,
  timesValidation,
}