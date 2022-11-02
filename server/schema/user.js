const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    googleAcc:{
        type:String
    },
    //For now snapshot field would only be snapshot of googledrive
    document:[{type: Number}],
    media:[{type: mongoose.Schema.Types.ObjectId, ref: 'media'}]


})
module.exports = mongoose.model('User', userSchema);