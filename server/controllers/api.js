const api = require("express").Router()
const Document = require("../models/Document")
const ResponseDataDict = require("../ResponseDataDict")
const rdd = new ResponseDataDict()

api.get("/connect/:id", async(req, res) => {
    const resRoomId = req.params.id
    const email = req.metadata.email
    rdd.createNewRoom(resRoomId, email, res)


    res.on("close", () => {
        console.log(`Client ${email} disconnected from`, resRoomId)
        rdd.user_response_lst[email] = rdd.user_response_lst[email].filter(resObj => resObj != res) 
        rdd.response_dct_lst[resRoomId] = rdd.response_dct_lst[resRoomId].filter(elem => elem.email != email && elem.response != res) 
        res.end()
    })
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
    // })

    // res.status(200).json({})
})

module.exports = api
