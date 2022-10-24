const api = require("express").Router()

d = {}
all_ops = {}

api.get("/connect/:id", async(req, res) => {
    console.log("Client connected to", req.params.id)
    let newConnect = true
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin' : '*',
        'Cache-Control': 'no-cache'
    });
    res.flushHeaders()
    const intervalId = setInterval(() => {
        if(newConnect) {
            res.write(`id:${req.params.id}\ndata:${JSON.stringify(all_ops[req.params.id])}\nevent:sync`)
            newConnect = false
        } else {
            if(d[req.params.id] != undefined && d[req.params.id].length > 0) {
                var data = d[req.params.id].shift()
                var str = JSON.stringify(data)
                res.write(`id:${req.params.id}\ndata:${str}\nevent:update`)
            }
        }
        res.write("\n\n")
    }, 0)

    res.on("close", () => {
        console.log("Client disconnected from", req.params.id)
        clearInterval(intervalId)
        res.end()
    })
})

api.post("/op/:id", async (req, res) => {
    const id = req.params.id
    if(d[id] == undefined) {
        d[id] = []
        all_ops[id] = []
    }
    d[id].push(req.body)
    all_ops[id].push(req.body)
    res.status(200).json({})
})

module.exports = api
