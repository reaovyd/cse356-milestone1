const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    name : {
        type: String
    }
})

module.exports = mongoose.model("documents", documentSchema)
