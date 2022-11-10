const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    name : {
        type: String
    },
    data :[[Number]]
})

module.exports = mongoose.model("documents", documentSchema)
