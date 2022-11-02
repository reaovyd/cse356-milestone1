const mongoose = require('mongoose');
const mediaSchema = new mongoose.Schema({
    Mime:{
        type:String
    },
    data:{
        type:Object
    }
})
module.exports = mongoose.model('media', mediaSchema);