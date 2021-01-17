const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },

    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:100
    },

    image:{

         type: String
    },
    cloudinary_id: {
        type: String,
      },
    description:{
        type:String
    },
    
    price:{
        type:Number
    },

    available:{
        type:Boolean,
        default:true,
        lowercase:true
    },

    created:{
        type:Date,
        default:Date.now
    } 

})

module.exports = mongoose.model('Product',productSchema)