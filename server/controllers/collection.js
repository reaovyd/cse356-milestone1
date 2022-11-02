const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const api = express();
const docDB = require('../schema/document')
const userDB = require('../schema/user')
const mediaDB = require('../schema/media')
api.post("/create", async(req, res) => {
    res_save[badIdImpl] = {id_count : 0, res_storage : [], name: req.body.name}
    badIdImpl ++
    
    res.status(200).json({id: badIdImpl - 1})

})
api.post("/delete", async(req, res) => {
    res_save[req.body.id] = undefined
    res.status(200).json({})
    
})
api.get("/list", async(req, res) =>{

})