const Admin = require("../models/Admin")
const jwt1 = require("jsonwebtoken")
const jwtSecret1 = process.env.JWT_SECRET1

const authGuardAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token_admin = authHeader && authHeader.split(" ")[1]

    // check if header has a token
    if(!token_admin) return res.status(401).json({ errors: ["Acesso negado!"]})

    // check if token is valid
    try {
      const verified = jwt1.verify(token_admin, jwtSecret1)

      req.admin = await Admin.findById(verified.id_admin).select("-password_admin")

      next()
    } catch (error) {
        res.status(401).json({errors: ["Token inválido."]})
    }
}

module.exports = authGuardAdmin