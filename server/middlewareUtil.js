const User = require("./models/User")
const jwt = require("jsonwebtoken")
const secret = "e3ca82b3a76ca310030e9e0a72d75d6929d08f09ba38700dba4c835e31243a14"

const tokenMiddleware = async(req, res, next) => {
    // console.log(req.originalUrl)
    // if req.originalUrl == /login 
    // don't do below
    if(req.session.token == null || req.session.token == undefined) {
        return res.status(400).json({
            "error" : true,
            "message" : "user must be logged in"
        })
    }
    try { 
        const email = jwt.verify(req.session.token, secret)
        req.metadata = {}
        req.metadata.email = email
        const findUser = await User.findOne({email: email})
        req.metadata.name = findUser.name 
        next()
    } catch(e) {
        return res.status(400).json({
            "error" : true,
            "message" : "invalid token"
        })
    }
}

module.exports = {tokenMiddleware}
