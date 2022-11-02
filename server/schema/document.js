const mongoose = require('mongoose');
const docSchema = new mongoose.Schema({
    name:{
        type:String
    }
})
module.exports = mongoose.model('document', docSchema);