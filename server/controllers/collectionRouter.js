const api = require("express").Router()
const Document = require("../models/Document") 
const DequeSingleton = require("../DequeSingleton")
const deque = new DequeSingleton()

api.post("/create", async(req, res) => {
    if(req.body.name == null || req.body.name == undefined) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing document name"
        })
    }
    var newDoc = new Document({
        name : req.body.name
    })
    const savedDoc = await newDoc.save()

    return res.status(400).json({
        "id": savedDoc._id
    })
})

api.post("/delete", async(req, res) => {
    if(req.body.id == null || req.body.id == undefined) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing document id"
        })
    }
    try {
        const savedDoc = await Document.findByIdAndDelete(req.body.id) 
        if(savedDoc == null || savedDoc == undefined) {
            return res.status(400).json({
                "error" : true,
                "message" : "unknown document"
            })
        }

        return res.status(400).json({
            "id": savedDoc._id
        })
    } catch(e) {
        return res.status(400).json({
            "error" : true,
            "message" : "invalid document id"
        })
    }
})

api.get("/list", async(req, res) => {
    return res.json(deque.getElements())
})

module.exports = api
