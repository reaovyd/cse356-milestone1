const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"

const docDB = require('../schema/document')
const userDB = require('../schema/user')
const mediaDB = require('../schema/media')
const bcrypt = require('bcrypt');
const session = require('express-session')

let badIdImpl = 0; 
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
    const existingUser = await userDB.findOne({ name: name });
    if (existingUser) {
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "This name is already taken."
            })
    }

    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, async(error, hash) => {
        try{
            let newAccount = new userDB({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            })
            const savedUser = await newAccount.save()
            
        }
        catch(err){
            console.error(err);
            res.status(500).send();
        }
    })

})
api.get("/verify", async(req, res)=>{

})
