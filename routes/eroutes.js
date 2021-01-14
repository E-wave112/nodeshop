//intialize express routers
const router = require('express').Router();
const csrf = require('csurf');
const bodyParser= require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const {ensureAuth} = require('../middleware/auth');
const product = require('../models/product');
const Category = require('../models/category');
const cloudinary = require("../utils/cloudinary");
const upload = require('../utils/multer');
const User = require('../models/User')
const csrfProtection = csrf({cookie:true});


//body parser middleware
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
router.use(cookieParser())


//multer middleware
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// const upload = multer({ storage: storage });
//landing page of the ecommerce app
router.get('/', async (req,res)=>{
    const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
    const user = await User.findById(req.params.id)
    const categories = await Category.find({}).sort({createdAt: -1}).lean()
    res.render('home-page', {
        products,categories,user
    })
})

//get  product details
router.get('/product/:id', ensureAuth, async (req,res)=> {
    try {
        const id = mongoose.Types.ObjectId(req.params.id)
        const Product = product.findById(id).populate('category').lean()
        res.render('product-page', {
            Product
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }


    res.render('product-page', {
        Product
    })
})

router.get('/pro', ensureAuth, (req,res) => {
    
    res.render('product-page')
})

//get the link to add a product to the eccomerce application using a GET request
router.get('/add-product', csrfProtection, ensureAuth, async (req,res) =>{

    try {
       const categories  = await Category.find().sort({createdAt:-1})
       //console.log(categories)
       res.render('addproduct',{csrfToken:req.csrfToken(),categories:categories})

    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})

//post the filled form
router.post('/add-product',  upload.single('image'), ensureAuth, parseForm, csrfProtection, async (req,res)=>{
    try {
         // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
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
router.get('/checkout', (req,res)=>{
    res.render('checkout-page')
})

module.exports = router