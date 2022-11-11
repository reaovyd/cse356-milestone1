const express = require("express")
const cors = require("cors")
const app = express()
const api = require("./controllers/api")
const userRouter = require("./controllers/userRouter")
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const Keygrip = require("keygrip")
const collectionRouter = require("./controllers/collectionRouter")
const middleware = require("./middlewareUtil")
const mediaRouter = require("./controllers/mediaRouter")
const path = require("path")

mongoose.connect("mongodb://127.0.0.1:27017/cse356").then(res => {
    console.log("Successfully connected to Mongo instance")
}).catch(err => {
    console.error("Could not connect to Mongo instance", err.message)
})


app.use(cors(
    {
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:80'],
    }
))


app.use(cookieSession({
    name : "session",
    keys: new Keygrip(["key1"], "SHA384"),
    httpOnly: false
}))

app.use(express.json())


app.use((req, res, next) => {
    res.setHeader("X-CSE356", "630a8972047a1139b66dbc48")
    next()
})

app.use("/users", userRouter)
app.use(middleware.tokenMiddleware)
app.use("/", express.static("build"))
app.use("/home", express.static("build"))
app.use("/edit/:id", express.static("build"))



app.use("/api", api)
app.use("/collection", collectionRouter)
app.use("/media", mediaRouter)

app.get("/library/crdt.js", async(req, res) => {
    res.sendFile(__dirname + "/dist/crdt.js")
})

module.exports = app
