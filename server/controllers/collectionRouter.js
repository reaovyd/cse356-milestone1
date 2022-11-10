const api = require("express").Router()
const Document = require("../models/Document") 

api.post("/create", async(req, res) => {
    if(req.body.name == null || req.body.name == undefined || req.body.name.length == 0) {
        return res.status(400).json({
            "error" : true,
            "message" : "missing document name"
        })
    }
    var newDoc = new Document({
        name : req.body.name
    })
    const savedDoc = await newDoc.save()


    return res.json({
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

        return res.json({
        })
    } catch(e) {
        return res.status(400).json({
            "error" : true,
            "message" : "invalid document id"
        })
    }
})

api.get("/list", async(req, res) => {
    const topTen = await Document.find({}).sort({date :-1}).limit(10)
    return res.json(topTen.map(elem => {
        const newRet = {
            id: elem._id,
            name : elem.name
        }
        return newRet
    }))
    // return res.json(ds.getElements())
})

module.exports = api
