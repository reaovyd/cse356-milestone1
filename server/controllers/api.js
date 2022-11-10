const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const api = express();
const EventEmitter = require("events").EventEmitter
export var res_save = {}
var full_doc = {}
export let recentEdit = []
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
    let id = req.params.id
    let name = res_save[req.params.id].name
    //update recent 10
    //filter out if the element already in the top 10
    recentEdit = recentEdit.filter(function(element) {
        return element.id != id
    })
    //add it to the top
    recentEdit.unshift({id, name})
    if (recentEdit.length > 10){
        //pop oldest
        recentEdit.pop()
    }

    res.status(200).json({})
})

module.exports = api
