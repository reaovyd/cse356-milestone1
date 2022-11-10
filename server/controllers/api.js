const express= require("express")
const mongoose = require('mongoose')
const mongoUrl = "mongodb://127.0.0.1:27017/crdt"
const EventEmitter = require("events").EventEmitter
var full_doc = {}
const api = require("express").Router()
const Document = require("../models/Document")
const ResponseDataDict = require("../ResponseDataDict")
const rdd = new ResponseDataDict()

// async function writeToDatabase(id) {
//     const doc = await Document.findById(id)
//     for(let elem of rdd.writeQueueDict[id]) {
//         doc.data.push(elem)
//     }
//     await Document.findByIdAndUpdate(doc._id, { data : doc.data}, { new: true })
//     rdd.writeQueueDict[id] = []
// 
//     return doc.data
// }

api.get("/connect/:id", async(req, res) => {
    try{
        const doc = await Document.findById(req.params.id)
        if(doc == null || doc == undefined) {
            return res.json({
                "error": true,
                "message": "document missing" 
            })
        }
        const resRoomId = req.params.id
        const email = req.metadata.email
        console.log(`Client ${email} connected to`, resRoomId)
        rdd.createNewRoom(resRoomId, email, res)
        // console.log(rdd)
        // const newData = await writeToDatabase(resRoomId)

        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin' : '*',
            'Cache-Control': 'no-cache'
        });

        const dataSend = {
            data : doc.data,
            "event" : "sync"
        }

        res.flushHeaders()
        res.write(`data:${JSON.stringify(dataSend)}\nevent:sync`)
        res.write("\n\n")

        const cursorDataSend = {
            session_id : req.session.token,
            name : req.metadata.name,
            cursor : rdd.presence_cursor[req.params.id]
        }

        rdd.response_dct_lst[resRoomId].forEach(elem => {
            const resWrite = elem.response
            resWrite.write(`data:${JSON.stringify(cursorDataSend)}\nevent:presence`)
            resWrite.write("\n\n")
        })

        // Whenever a client disconnects from the event stream, send a "presence" event with a blank cursor {} object to all clients that are still connected.  

        res.on("close", () => {
            console.log(`Client ${email} disconnected from`, resRoomId)
            rdd.user_response_lst[email] = rdd.user_response_lst[email].filter(resObj => resObj != res) 
            rdd.response_dct_lst[resRoomId] = rdd.response_dct_lst[resRoomId].filter(elem => elem.email != email && elem.response != res) 
            console.log(rdd.user_response_lst)
            console.log(rdd.response_dct_lst)
            //rdd.response_dct_lst[resRoomId].forEach(elem => {
            //    const resWrite = elem.response
            //})

            //if(rdd.response_dct_lst[resRoomId].length == 0) {
            //    writeToDatabase(resRoomId)
            //}
            res.end()
        })
    }catch(e) {
        console.log(e)
        return res.json({
            "error": true,
            "message": e 
        })
    }
})

api.post("/op/:id", async(req, res) => {
    try{
        const getDoc = await Document.findById(req.params.id) 
        if(getDoc == null || getDoc == undefined) {
            return res.status(400).json({
                "error" : true,
                "message" : "document does not exist"
            })
        }
        const data = req.body.data
        if(data == undefined || data == null) {
            return res.status(400).json({
                "error" : true,
                "message" : "no data found"
            })
        }
        await Document.findByIdAndUpdate(getDoc._id, { data : getDoc.data.concat([data]), date: new Date()}, { new: true })
        //console.log(rdd.writeQueueDict)
        //if(rdd.writeQueueDict[req.params.id].length >= 25) {
        //    writeToDatabase(req.params.id)
        //}
        //rdd.writeQueueDict[req.params.id].push(data)
        const dataSend = {
            data,
            "event" : "update"
        }

        // this.response_dct_lst[resRoomId].push({email, response})
        rdd.response_dct_lst[req.params.id].forEach((elem) => {
            const resWrite = elem.response
            resWrite.write(`data:${JSON.stringify(dataSend)}\nevent:update`)
            resWrite.write("\n\n")
        })

        return res.json({})
    }catch(e) {
        console.log(e)
        return res.status(400).json({
            "error" : true,
            "message": "invalid doc"
        })
    }
})

api.post("/presence/:id", async(req, res) => {
    const idx = req.body.index
    const length = req.body.length
    // console.log(rdd.presence_cursor[req.params.id])
    if(idx == null || idx == undefined || length == undefined || length == null) {
        return res.json({
            error: true,
            "message": "payload is missing one or more arguments"
        })
    }
    const dataSend = {
        session_id : req.session.token,
        name : req.metadata.name,
        cursor : {index : idx, length : length}
    }
    rdd.presence_cursor[req.params.id] = dataSend.cursor
    rdd.response_dct_lst[req.params.id].forEach((elem) => {
        const resWrite = elem.response
        resWrite.write(`data:${JSON.stringify(dataSend)}\nevent:presence`)
        resWrite.write("\n\n")
    })

    return res.json({})
})

// var res_save = {}
// var full_doc = {}
// 
// api.get("/connect/:id", async(req, res) => {
//     const id = req.params.id
//     if(res_save[id] == undefined) {
//         full_doc[id] = []
//         res_save[id] = {id_count : 1, res_storage : []}
//     }
//     res.writeHead(200, {
//         'Connection': 'keep-alive',
//         'Content-Type': 'text/event-stream',
//         'Access-Control-Allow-Origin' : '*',
//         'Cache-Control': 'no-cache'
//     });
//     const clientId = `${id}-${res_save[id].id_count++}` 
// 
//     const dataSend = {
//         data : full_doc[id],
//         "event": "sync"  
//     }
// 
//     res.flushHeaders()
//     res.write(`id:${clientId}\ndata:${JSON.stringify(dataSend)}\nevent:sync`)
//     res.write("\n\n")
// 
//     res_save[id].res_storage.push([clientId, res])
// 
// 
//     res.on("close", () => {
//         console.log(`Client ${clientId} disconnected from`, id)
//         res_save[id].res_storage = res_save[id].res_storage.filter(elem => elem[0] != clientId)
//         res.end()
//     })
// })
// 
api.post("/op/:id", async(req, res) => {
    const email = req.metadata.email 
    const data = req.body.data

    // full_doc[req.params.id].push(req.body.data)
    // const dataSend = {
    //     data : req.body.data,
    //     "event" : "update"
    // }
    // res_save[req.params.id].res_storage.forEach((elem) => {
    //     const resWrite = elem[1]
    //     resWrite.write(`id:${elem[0]}\ndata:${JSON.stringify(dataSend)}\nevent:update`)
    //     resWrite.write("\n\n")
    //
 })

module.exports = api
