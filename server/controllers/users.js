const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const crypto = require("crypto")
const docDB = require('../schema/document')
const userDB = require('../schema/user')
const mediaDB = require('../schema/media')
const bcrypt = require('bcrypt');
const session = require('express-session')
const { exec } = require("child_process");
api.use(session({
    secret: 'secret',
    saveUninitialized: false,
}))
api.post("/login", async(req, res) => {   
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." });
    }

    let existingUser = await userDB.findOne({ email: email });
    if (!existingUser) {
        return res
            .status(401)
            .json({
                success: false,
                errorMessage: "Wrong email or password."
            })
    }

    const correctPass = await bcrypt.compare(password, existingUser.password);
    if (!correctPass) {
        return res
            .status(401)
            .json({
                success: false,
                errorMessage: "Wrong email or password."
            })
    }

    if (req.session.authenticated){
        res.json(req.session)
    }
    else{
        let name = existingUser.name
        res.session.authenticated = true;
        req.session.name = {name}
        res.json(req.session)
    }

})

api.post("/logout", async(req, res) => {
    req.session.destroy
    
})
api.post("/signup", async(req, res) =>{
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." });
    }
    const existingEmail = await userDB.findOne({ email: email });
    if (existingEmail) {
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "An account with this email address already exists."
            })
    }

    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, async(error, hash) => {
        try{
            let newAccount = new userDB({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                key: crypto.createHash("md5").update(newUser.email).digest("hex") 
            })
            const savedUser = await newAccount.save()
            const url = `http://localhost:8080/users/verify?email=${savedUser.email}&key=${savedUser.key}`
            exec(`echo ${url} | mail -s --encoding=quoted-printable "Verify Your Email" ${savedUser.email}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });

            
        }
        catch(err){
            console.error(err);
            res.status(500).send();
        }
    })

})
api.get("/verify", async(req, res) => {
    if(!req.query.email || !req.query.key) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing one or more payload elements"
        })
    }

    const findUser = await User.findOne({"email" : req.query.email})
    console.log(findUser)
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
