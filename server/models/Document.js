const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    name : {
        type: String
    },
    data :[[Number]],
    date : {
        type: Date,
        default: () => new Date()
    }
})

module.exports = mongoose.model("documents", documentSchema)
