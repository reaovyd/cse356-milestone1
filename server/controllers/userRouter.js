const api = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const ResponseDataDict = require("../ResponseDataDict")
const rdd = new ResponseDataDict()

const secret = "e3ca82b3a76ca310030e9e0a72d75d6929d08f09ba38700dba4c835e31243a14"

api.post("/signup", async(req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing one or more payload elements"
        })
    }
    // TODO The /users/signup request must send an email to the user's email address which instructs the user to access a verification URL.
    const findUser = await User.findOne({"email" : req.body.email}) 
    if(findUser != null && findUser != undefined) {
        return res.json({
            "error" : true,
            "message" : "user has already signed up"
        })
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10) 
    var newUser = {
        "name" : req.body.name,
        "email" : req.body.email,
        "password" : passwordHash 
    } 

    try {
        const email = newUser.email
        const key = crypto.createHash("md5").update(newUser.email).digest("hex") 
        newUser.key = key

        const user = new User(newUser)
        await user.save()

        return res.json({
            url : `http://localhost:8080/users/verify?email=${email}&key=${key}`
        })


    } catch(e) {
        return res.status(400).json({
            "error" : true,
            "message" : e
        })
    }
})

api.get("/verify", async(req, res) => {
    if(!req.query.email || !req.query.key) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing one or more payload elements"
        })
    }

    const findUser = await User.findOne({"email" : req.query.email})
    if(findUser == undefined || findUser == null) {
        return res.status(400).json({
            "error" : true,
            "message" : "user cannot be found"
        })
    }
    if(findUser.key != req.query.key) {
        return res.status(400).json({
            "error" : true,
            "message" : "invalid key"
        })
    }

    if(findUser.activated) {
        return res.status(400).json({
            "error" : true,
            "message" : "this account has already been activated"
        })
    }

    findUser.activated = true
    await User.findByIdAndUpdate(findUser._id, findUser, {new: true})
    res.status(200).json({
        "status": "OK",
        "message" : "user has been activated"
    })
})

api.post("/login", async(req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.json({
            error: true,
            "message" : "missing one or more payload elements"
        })
    }
    const findUser = await User.findOne({email : req.body.email})
    if(findUser == null || findUser == undefined) {
        return res.json({
            error: true,
            "message" : "user does not exist"
        })
    }

    const isEqualPasswords = await bcrypt.compare(req.body.password, findUser.password)

    if(!isEqualPasswords || !findUser.activated) {
        return res.json({
            error: true,
            "message" : "user has not activated or invalid pass"
        })
    }

    if(req.session.token != null || req.session.token != undefined) {
        return res.json({
            error: true,
            "message" : "user is already logged in"
        })
    }

    const token = jwt.sign(findUser.email, secret)
    req.session.token = token
    return res.json({
        "name": findUser.name
    })

})

api.post("/logout", async(req, res) => {
    // TODO terminate ALL event streams for req.session.token

    if(req.session.token == undefined || req.session.token == null) {
        return res.json({
            error: true,
            "message" : "user is not logged in"
        })
    }
    const email = jwt.verify(req.session.token, secret)
    if(rdd.user_response_lst[email] != undefined && rdd.user_response_lst[email] != null) {
        const userResponseList = [...rdd.user_response_lst[email]]
        userResponseList.forEach(response => {
            response.connection.end()
        })
    }
    req.session = null


    return res.json({
    })
})

module.exports = api

