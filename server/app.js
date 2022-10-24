const express = require("express")
const cors = require("cors")
const app = express()
const api = require("./controllers/api")

app.use(cors())
app.use(express.json())

app.use("/api", api)
app.get("/", async(req, res, next) => {
    res.sendFile(__dirname + "/index.html")
})


module.exports = app
