const cloudinary = require("cloudinary").v2;
const  {cloudStorage} = require('multer-storage-cloudinary');
const dotenv = require('dotenv').config({path:__dirname+'/.env'});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  }); 


module.exports = cloudinary