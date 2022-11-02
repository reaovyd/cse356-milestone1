const mongoose = require('mongoose');
const docSchema = new mongoose.Schema({
    text:{
        type:String
    }
})
module.exports = mongoose.model('document', docSchema);