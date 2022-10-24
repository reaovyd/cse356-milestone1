const app = require("./app")
const http = require("http")
server = http.createServer(app)

const PORT = 8080

server.listen(PORT, () => {
    console.log(`Started server on ${PORT}`)
})
