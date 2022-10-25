const express = require("express")
const cors = require("cors")
const app = express()
const api = require("./controllers/api")

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

app.use((req, res, next) => {
    res.setHeader("X-CSE356", "630a8972047a1139b66dbc48")
    next()
})
app.use("/api", api)

app.get("/library/crdt.js", async(req, res) => {
    res.sendFile(__dirname + "/dist/crdt.js")
})

app.get("/", async(req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/check", async(req, res) => {
    res.sendFile(__dirname + "/index1.html")
})


module.exports = app
