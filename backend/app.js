require("dotenv").config()

const express = require("express")
const path = require("path")
const cors = require("cors")

const port = process.env.PORT || 5000;

const app = express()

// config JSON and form data response
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// DB connection
const connectToDB = require("./config/db.js")
connectToDB()

// routes
const router = require("./routes/Router.js")

// Modify the base URL for the routes
app.use(router)

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`)
})