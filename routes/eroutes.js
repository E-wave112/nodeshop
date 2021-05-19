//intialize express routers
const router = require('express').Router();
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const {ensureAuth} = require('../middleware/auth');
const product = require('../models/product');
const Category = require('../models/category');
const cloudinary = require("../utils/cloudinary");
const User = require('../models/User')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const async = require('async');
const upload = require("../utils/multer");
const payment = require('../models/paymodel');
//require the coinbase clinet
const coinbaseClient = require('coinbase').Client;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let client = new coinbaseClient({
    'apiKey': process.env.COINBASE_API_KEY,
    'apiSecret': process.env.COINBASE_API_SECRET,
    'version':'YYYY-MM-DD',
    strictSSL:false
  });



//create a global transport object
let transport = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass:process.env.MAIL_TRAP_PASS
      }
    }


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


router.get('/', async (req,res)=>{
    
    const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
    const id = mongoose.Types.ObjectId(req.params.id)
    const user = await User.find({}).lean()
    limit = req.query.limit 
    req.query.page = ~~( products.length/req.query.limit)
    console.log(req.query.page)
    const categories = await Category.find({}).sort({createdAt: -1}).lean()
    res.render('home-page', {
        products,categories,user,id
    })
    
})

//filter products by category
router.get('/category', async (req,res) => {

    let cates = [];
    const products = await product.find({}).populate('category').sort({createdAt: -1}).lean()
    const categories = await Category.find({}).sort({createdAt: -1}).lean()
    categories.forEach(cat => {
        cates.push(cat.category)
    });
    for (let cat of cates){
        if (! req.query.category === cat){
            res.redirect('/');
        } 
            var productFilt = products.filter(prod=>prod.category === cat);
        
    }
    console.log(productFilt, products)

    res.render('productfilter',{
        products,cates,productFilt
    })

})


//get  product details
router.get('/product/:id',  ensureAuth, csrfProtection, async (req,res)=> {

        let coinPriceUsd = () => {
            currencyCode = 'USD'
            currencyCode_n = 'NGN'
             
          client.getSpotPrice({'currency': currencyCode}, async function (err,price) {
                 currUs = price.data.amount;
                console.log(currUs)
             return currUs
             });
     
        //  client.getSpotPrice({'currency': currencyCode_n}, async function (err,price) {
                 
        //          currNg = await price.data.amount;
        //          console.log(currNg)
        //      });
    
        }

       let v = coinPriceUsd(); 

    try {
        
        const id = mongoose.Types.ObjectId(req.params.id)
        const Product = await product.findById(id).populate('category').lean()
        const ngnAmount = Product.price * 379.9;
        res.render('product-page', {
            Product,ngnAmount, csrfToken:req.csrfToken()
        })
        console.log(Product,ngnAmount)
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


//post request for payment
router.post('/product/:id',ensureAuth,csrfProtection, parseForm,async (req,res)=>{
    //assert the populate db relationship
    req.body.user = req.user.id
    //create an array to store payment data in the db
    var arr = []
    async.waterfall([
        function(done){
            let pay = new payment({
                amount:req.body.amount,
                email:req.body.email,
                firstname:req.body.firstname,
                lastname:req.body.lastname
            })
            //push the newly created data into the array
            arr.push(pay)
            pay.save((err)=>{
                done(err,pay)
            });
        },
        function(pay,done){
            if (!process.env.NODE_ENV === 'production'){
    
   
            let transporter = nodemailer.createTransport(transport)
               // send mail with defined transport object
               let info =  transporter.sendMail({
                from: 'iyayiemmanuel1@gmail.com', // sender address
                to: pay.email, // list of receivers
                subject: "Notice of a Transaction", // Subject line,
                html: `<b>Dear ${pay.firstname} your payment has been recieved and verified !</b>`, // html body
               }, (err,info)=>{
                   if (err){
                       console.error(err)
                   }
                   else{
                       console.log(info)
                   }
                   done(err,'done')
               });

            }else {
                const msg = {
                    to: pay.email, // Change to your recipient
                    from: 'iyayiemmanuel1@gmail.com', // Change to your verified sender
                    subject: 'Notice of a Transaction',
                    text: `Dear ${pay.firstname} your payment has been recieved and verified !`,
                    html:  `<b>Dear ${pay.firstname} your payment has been recieved and verified !</b>`,
                  }
                  
                  sgMail
                    .send(msg)
                    .then(() => {
                      console.log('Email sent')
                    })
                    .catch((error) => {
                      console.error(error)
                    })
            }
        }

    ], function(err){
        if (err){
            console.error(err)
            res.redirect('/');
            return next(err);
        }
        else{
            console.log('data', data)
            res.redirect('/process/complete');
        }
    });
    // try {
    //     req.body.user = req.user.id
    //     await payment.create(req.body)
    //     res.redirect('/payment/payment_complete')
    // }

    // catch (err){
    //     console.error(err)
    //     res.render('error/500')
    // }
  
 })


//get the link to add a product to the eccomerce application using a GET request
router.get('/add-product',  ensureAuth, csrfProtection, async (req,res) =>{

    try {
       const categories  = await Category.find().sort({createdAt:-1});
       //console.log(categories)
       res.render('addproduct',{categories:categories,csrfToken:req.csrfToken()})

    } catch (err) {
        console.error(err);
        res.render('error/500');
        
    }
})

//post the filled form
router.post('/add-product', upload.single("image"),ensureAuth, parseForm, csrfProtection,async (req,res)=>{
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



module.exports = router