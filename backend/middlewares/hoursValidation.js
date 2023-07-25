const {body} = require("express-validator")

const hoursValidation = () => {
  return [
    body("hour")
      .isString()
      .withMessage('A hora é obrigatória')
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Formato de hora inválido (HH:mm)')
  ];
};


module.exports = {
  hoursValidation
}