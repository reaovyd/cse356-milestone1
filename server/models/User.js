const mongoose = require("mongoose")
const mongooseValidator = require("mongoose-unique-validator")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    key: {
        type: String
    }
})

userSchema.plugin(mongooseValidator, {status: "ERROR"})

module.exports = mongoose.model("users", userSchema)

