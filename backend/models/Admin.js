const mongoose = require("mongoose")
const {Schema} = mongoose

const adminSchema = new Schema(
  {
    name_admin: String,
    email_admin: String,
    password_admin: String,
  },
  {
    timestamps: true
  }
)

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin