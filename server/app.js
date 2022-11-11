const express = require("express")
const cors = require("cors")
const app = express()
const api = require("./controllers/api")
const userRouter = require("./controllers/userRouter")
const mongoose = require("mongoose")
// const cookieSession = require("cookie-session")
// const Keygrip = require("keygrip")
const collectionRouter = require("./controllers/collectionRouter")
const middleware = require("./middlewareUtil")
const mediaRouter = require("./controllers/mediaRouter")

const expressSession = require("express-session")
const cookieParser = require("cookie-parser")
const secret = "e3ca82b3a76ca310030e9e0a72d75d6929d08f09ba38700dba4c835e31243a14"

mongoose.connect("mongodb://127.0.0.1:27017/cse356").then(res => {
    console.log("Successfully connected to Mongo instance")
}).catch(err => {
    console.error("Could not connect to Mongo instance", err.message)
})


app.use(cors(
    {
        credentials: true,
        origin: true
    }
))

app.use(cookieParser())

// TODO do express-session; might solve the problem? 
app.use(expressSession({
    secret: secret, 
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}))

// app.use(cookieSession({
//     name : "session",
//     keys: new Keygrip(["key1"], "SHA384"),
//     httpOnly: false
// }))

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
