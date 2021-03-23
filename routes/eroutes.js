//intialize express routers
const router = require('express').Router();
const {v4: uuid } = require('uuidv4');
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {ensureAuth,ensureGuest} = require('../middleware/auth');
const product = require('../models/product');
const Category = require('../models/category');
const cloudinary = require("../utils/cloudinary");
const User = require('../models/User')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const async = require('async');
const upload = require("../utils/multer");


// error handler
router.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN'){
    // handle CSRF token errors here
    res.status(403)
    res.render('error/403')
    return next(err)

    } 
  
    
  })
//cookie parser middleware
router.use(cookieParser())

//body parser middleware
const parseForm = bodyParser.urlencoded({extended:true})

//csrf middleware
const csrfProtection = csrf({cookie:true});

//default home page for an authenticated user 

// router.get('/:id', ensureAuth, async (req,res)=>{
//     const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
//     const id = mongoose.Types.ObjectId(req.params.id)
//     const user = await User.find({}).lean()
//     const categories = await Category.find({}).sort({createdAt: -1}).lean()
//     res.redirect('/')
//     res.render('home-page', {
//         products,categories,user,id
//     })
//     console.log(user)
// })


router.get('/', async (req,res)=>{
    const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
    const id = mongoose.Types.ObjectId(req.params.id)
    const user = await User.find({}).lean()
    const categories = await Category.find({}).sort({createdAt: -1}).lean()
    res.render('home-page', {
        products,categories,user,id
    })
    console.log(user)
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
        const x = x.collection()
        const Categories = await Category.find({category:category})
        //execute the queryfilter method with a callback function
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
router.post('/add-product', upload.single("image"),ensureAuth, parseForm, csrfProtection,async (req,res)=>{
    try {
         // Upload image to cloudinary
         console.log(req)
         console.log(req.file)
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



module.exports = router