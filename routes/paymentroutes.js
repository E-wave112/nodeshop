const router = require('express').Router()
const {ensureAuth} = require('../middleware/auth');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const payment = require('../models/paymodel');
const nodemailer = require('nodemailer');
const async = require('async');
const auth = require('../middleware/auth');


//cookie middleware
router.use(cookieParser())
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
//csrf middleware
const csrfProtection = csrf({cookie:true})

//router to get payment view
router.get('/pay', csrfProtection, ensureAuth, (req,res)=>{
    res.render('payment/payment_process',{csrfToken:req.csrfToken()})
})

//route for completed payment
router.get('/complete', (req,res)=>{
    res.render('payment/payment_complete')
})

//post request for payment
router.post('/pay', parseForm,csrfProtection,ensureAuth, async (req,res)=>{
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
            })
        },
        function(pay,done){
            let transporter = nodemailer.createTransport({
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
               })

        }

    ], function(err){
        if (err){
            console.error(err)
            res.redirect('/pay');
            return next(err);
        }
        else{
            console.log('data', data)
            res.redirect('/complete');
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

module.exports = router