const express = require("express")
const cors = require("cors")
const app = express()
const api = require("./controllers/api")
const user = require("./controllers/users")
const collection = require("./controllers/collection")
const userRouter = require("./controllers/userRouter")
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const Keygrip = require("keygrip")
const collectionRouter = require("./controllers/collectionRouter")
const middleware = require("./middlewareUtil")

mongoose.connect("mongodb://127.0.0.1:27017/cse356").then(res => {
    console.log("Successfully connected to Mongo instance")
}).catch(err => {
    console.error("Could not connect to Mongo instance", err.message)
})

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

app.use((req, res, next) => {
    res.setHeader("X-CSE356", "630a8972047a1139b66dbc48")
    next()
})

app.use(cookieSession({
    name : "session",
    keys: new Keygrip(["key1"], "SHA384") 
}))

app.use("/users", userRouter)

app.use(middleware.tokenMiddleware)
app.use("/api", api)

app.get("/library/crdt.js", async(req, res) => {
    res.sendFile(__dirname + "/dist/crdt.js")
})

module.exports = app
