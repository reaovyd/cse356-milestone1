const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const api = express();
const EventEmitter = require("events").EventEmitter
var res_save = {}
var full_doc = {}
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
api.post("/users/login", async(req, res) => {   
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
    res.send(document.cookie = `name = ${existingUser.name}`)

})

api.post("/users/logout", async(req, res) => {
    req.session.destroy
    
})
api.post("/users/signup", async(req, res) =>{
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
api.get("/users/verify?any=parameters&you=need&key=KEY", async(req, res)=>{

})
api.post("/collection/create", async(req, res) => {
    res_save[badIdImpl] = {id_count : 0, res_storage : [], name: req.body.name}
    badIdImpl ++
    res.status(200).json({id: badIdImpl - 1})

})
api.post("/collcetion/delete", async(req, res) => {
    res_save[req.body.id] = undefined
    res.status(200).json({})
    
})
api.get("/collection/list", async(req, res) =>{

})

api.get("/connect/:id", async(req, res) => {
    const id = req.params.id
    if(res_save[id] == undefined) {
        full_doc[id] = []
        res_save[id] = {id_count : 1, res_storage : []}
    }
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin' : '*',
        'Cache-Control': 'no-cache'
    });
    const clientId = `${id}-${res_save[id].id_count++}` 

    const dataSend = {
        data : full_doc[id],
        "event": "sync"  
    }

    res.flushHeaders()
    res.write(`id:${clientId}\ndata:${JSON.stringify(dataSend)}\nevent:sync`)
    res.write("\n\n")

    res_save[id].res_storage.push([clientId, res])


    res.on("close", () => {
        console.log(`Client ${clientId} disconnected from`, id)
        res_save[id].res_storage = res_save[id].res_storage.filter(elem => elem[0] != clientId)
        res.end()
    })
})

api.post("/op/:id", async(req, res) => {
    full_doc[req.params.id].push(req.body.data)
    const dataSend = {
        data : req.body.data,
        "event" : "update"
    }
    res_save[req.params.id].res_storage.forEach((elem) => {
        const resWrite = elem[1]
        resWrite.write(`id:${elem[0]}\ndata:${JSON.stringify(dataSend)}\nevent:update`)
        resWrite.write("\n\n")
    })

    res.status(200).json({})
})

module.exports = api
