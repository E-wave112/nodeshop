const router = require('express').Router()
const {ensureAuth} = require('../middleware/auth');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const payment = require('../models/paymodel');
const product = require('../models/product');
const nodemailer = require('nodemailer');
const async = require('async');
const auth = require('../middleware/auth');
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//create a global transport object
let transport = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass:process.env.MAIL_TRAP_PASS
      }
    }


//cookie middleware
router.use(cookieParser())
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
//csrf middleware
const csrfProtection = csrf({cookie:true})

//router to get payment view
router.get('/product/pay/:id', csrfProtection, ensureAuth, (req,res)=>{
    const id = mongoose.Types.ObjectId(req.params.id)
    let Product = product.findById(id).populate('category').lean();

    res.render('payment/payment_process',{
        Product,
        csrfToken:req.csrfToken()
    });
    console.log(Product);
    
});

//route for completed payment
router.get('/complete', (req,res)=>{

    if (! req.query.reference){
        res.redirect('/')
    }
    res.render('payment/payment_complete')
});

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
            res.redirect('/pay');
            return next(err);
        }
        else{
            console.log('data', data)
            res.redirect('/process/complete');
        }
    });

  
 })

module.exports = router;