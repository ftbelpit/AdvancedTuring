const express = require("express")
const router = express()

router.use("/api/admins", require("./AdminRoutes"))
router.use("/api/users", require("./UserRoutes"))
router.use("/api/cars", require("./CarRoutes"))
router.use("/api/washers", require("./WasherRoutes"))
router.use("/api/washes", require("./WashRoutes"))

// test route
router.get("/", (req, res) => {
  res.send("API Working!")
})

module.exports = router