//intialize express routers
const router = require('express').Router();
const {v4: uuid } = require('uuidv4');
const cookieParser = require('cookie-parser');
const bodyParser= require('body-parser');
const csrf = require('csurf');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {ensureAuth} = require('../middleware/auth');
const product = require('../models/product');
const Category = require('../models/category');
const cloudinary = require("../utils/cloudinary");
const User = require('../models/User')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const async = require('async')

//csrf middleeware
router.use(cookieParser())
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
const csrfProtection = csrf({cookie:true});
//body parser middleware



router.get('/', async (req,res)=>{
    const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
    const user = await User.findById(req.params.id)
    const categories = await Category.find({}).sort({createdAt: -1}).lean()
    res.render('home-page', {
        products,categories,user
    })
})

//get  product details
router.get('/product/:id',  ensureAuth, csrfProtection, async (req,res)=> {
    try {
        const id = mongoose.Types.ObjectId(req.params.id)
        const Product = await product.findById(id).populate('category').lean()
        res.render('product-page', {
            Product,csrfToken:req.csrfToken()
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

//filter product by category
router.get('product/:category', ensureAuth, async (req,res)=>{
    try {
        const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
        
        const category  = req.params.category
        const Categories = await Category.find({category:category})
        //execute the queryfilter method with acallback function
        Categories.exec(function(err,catdata) {
            if (err) return handleError(err);
            console.log(catdata)
        })
        // console.log(doc,category)
        res.render('home-page',{
            products,Categories
        })
        
    } catch (err) {
        console.error(err)
        res.render('error/404')
        
    }
})

//get the link to add a product to the eccomerce application using a GET request
router.get('/add-product',  ensureAuth, csrfProtection, async (req,res) =>{

    try {
       const categories  = await Category.find().sort({createdAt:-1})
       //console.log(categories)
       res.render('addproduct',{categories:categories,csrfToken:req.csrfToken()})

    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})

//post the filled form
router.post('/add-product',ensureAuth, parseForm, csrfProtection, async (req,res)=>{
    try {
         // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    //assert the populate db relationship
        req.body.user = req.user.id

        let Product = new product({
            category: req.body.category,
            name: req.body.name,
            image: result.secure_url,
            description:req.body.description,
            price:req.body.price,
            
        })
       await Product.save()
        res.redirect('/')
        
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})



router.get('/login', (req,res) =>{
    res.render('login')
})



//payment processing route
router.get('/confirm',  ensureAuth, (req,res)=>{
     // create reusable transporter object using the default SMTP transport
  let transporter =  new nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:process.env.user,
        pass: process.env.pass
    },

  });

   // send mail with defined transport object
   let info =  transporter.sendMail({
    from: 'iyayiemmanuel1@gmail.com', // sender address
    to: " osagieiyayi09@gmail.com", // list of receivers
    subject: "NodeCommerce", // Subject line
    text: "Dear customer you have successfully completed an order,your order id for this product is " + uuid(), // plain text body
    html: `<b>Dear customer you have successfully completed an order,your order id for this product is ${uuid()}</b>`, // html body
  },( err,info)=>{
      if (err){
          console.error(err)
      }else {
          console.log(info)
      }
  });

})



module.exports = router