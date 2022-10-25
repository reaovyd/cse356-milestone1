const api = require("express").Router()
const EventEmitter = require("events").EventEmitter
const em = new EventEmitter() 


em.on("new_conn", (data, res) => {
    if(d[data.id] == undefined) {
        d[data.id] = {id_count : 1, num_ids : []}
        all_ops[data.id] = []
    } 
    var clientId = `${data.id}-${d[data.id].id_count}`
    console.log(`Client ${clientId} connected`)

        
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin' : '*',
        'Cache-Control': 'no-cache'
    });
    res.flushHeaders()
    res.write(`id:${data.id}\ndata:${JSON.stringify(all_ops[data.id])}\nevent:sync`)
    res.write("\n\n")


    d[data.id].num_ids.push(`${clientId}`)
    d[data.id].id_count += 1

    res.on("close", () => {
        console.log(`Client ${clientId} disconnected from`, data.id)
        d[data.id].num_ids = d[data.id].num_ids.filter(elem => elem != clientId)
        res.end()
    })
})


var d = {}
var all_ops = {}

api.get("/connect/:id", async(req, res) => {
    em.emit("new_conn", req.params, res)
    em.on(`update-${req.params.id}`, (data, updateValue) => {
        res.write(`id:${data.id}\ndata:${JSON.stringify(updateValue)}\nevent:update`)
        res.write("\n\n")
    })
})

api.post("/op/:id", async (req, res) => {
    if(all_ops[req.params.id] == undefined) {
        return res.status(200).json({})
    }
    all_ops[req.params.id].push(req.body)
    em.emit(`update-${req.params.id}`, req.params, req.body) 
    res.status(200).json({})
})

module.exports = api
