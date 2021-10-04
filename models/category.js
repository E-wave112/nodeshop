const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        trim:true
    },

    createdAt:{
        type:Date,
        default:Date.now()
    } 
    

})

module.exports = mongoose.model('Category',categorySchema)