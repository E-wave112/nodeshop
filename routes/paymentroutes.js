const router = require('express').Router()
const {ensureAuth} = require('../middleware/auth');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const payment = require('../models/paymodel');

//csrf middleware
const csrfProtection = csrf({cookie:true})
router.use(csrfProtection())
//cookie middleware
router.use(cookieParser())
const parseForm = bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())

router.get('/pay', csrfProtection, ensureAuth, (req,res)=>{
    res.render('payment/payment_process')
})

//post request for payment
router.post('/pay', parseForm,csrfProtection,ensureAuth, async (req,res)=>{
    //assert the populate db relationship
    try {
        req.body.user = req.user.id
        await payment.create(req.body)
        res.redirect('/payment/payment_complete')
    }

    catch (err){
        console.error(err)
        res.render('error/500')
    }
  

 })