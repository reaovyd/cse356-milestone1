const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const api = express();
const docDB = require('../schema/document')
const userDB = require('../schema/user')
const mediaDB = require('../schema/media')
import res_save from './api'
import recentEdit from './api'
api.post("/create", async(req, res) => {
    let doc = await new docDB({name: req.body.name})
    let id = doc._id
    let name = req.body.name
    res_save[id] = {id_count : 0, res_storage : [], name: req.body.name}
    //update top 10
    recentEdit.unshift({id: id, name: name});
    if (recentEdit.length > 10){
        recentEdit.pop()
    }
    res.status(200).json({id: doc._id})

})
api.post("/delete", async(req, res) => {
    await docDB.findOneAndDelete({_id: req.body.id})
    res_save[req.body.id] = undefined
    res.status(200).json({})
    
})
api.get("/list", async(req, res) =>{
    return recentEdit

})