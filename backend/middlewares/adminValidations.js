const {body} = require("express-validator")

const adminCreateValidation = () => {
  return [
    body("name_admin")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({min: 3})
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
    body("email_admin")
      .isString()
      .withMessage("O e-mail é obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    body("password_admin")
      .isString()
      .withMessage("A senha é obrigatória")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 carateres"),
    body("confirmPassword_admin")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, {req}) => {
        if (value != req.body.password_admin) {
          throw new Error("As senhas não são iguais.")
        }
        return true
      }),
  ] 
}

const adminLoginValidation = () => {
  return [
    body("email_admin")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password_admin")
      .isString()
      .withMessage("A senha é obrigatória"),
  ]
}

const adminUpdateValidation = () => {
  return [
    body("name_admin")
      .optional()
      .isLength({ min:3 })
      .withMessage("O nome precisa de pelo menos 3 caracteres."),
    body("password_admin")
      .optional()
      .isLength({ min:5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres.")
  ]
}

module.exports = {
  adminCreateValidation,
  adminLoginValidation,
  adminUpdateValidation,
}