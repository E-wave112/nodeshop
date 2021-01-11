//intialize express routers
const router = require('express').Router();
const csrf = require('csurf');
const bodyParser= require('body-parser');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const {ensureAuth} = require('../middleware/auth');
const product = require('../models/product');
const Category = require('../models/category');
const csrfProtection = csrf({cookie:true});


//body parser middleware
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
router.use(cookieParser())


//multer middleware
const upload = multer({ dest: 'uploads/' })
//landing page of the ecommerce app
router.get('/', (req,res)=>{
    res.render('home-page')
})

//get  product details
router.get('/product:/id', (req,res)=>{
    

    res.render('product-page')
})

//get the link using a GET request
router.get('/add-product', csrfProtection, ensureAuth, async (req,res) =>{

    try {
       const categories  = await Category.find().sort({createdAt:-1})
       console.log(categories)
       res.render('addproduct',{csrfToken:req.csrfToken(),categories:categories})
    } catch (err) {
        console.error(err)
        res,render('error/500')
        
        
    }
})
//post the filled form
router.post('/add-product',  upload.single('avatar'), ensureAuth, parseForm, csrfProtection, async (req,res)=>{
    try {
        req.body.user = req.user.id
        await product.create(req.body)
        res.redirect('/')
    } catch (err) {
        console.error(err)
        res,render('error/500')
    }
})

router.get('/checkout', (req,res)=>{
    res.render('checkout-page')
})

router.get('/login', (req,res) =>{
    res.render('login')
})

module.exports = router