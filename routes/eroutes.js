//intialize express routers
const router = require('express').Router();

//landing page of the ecommerce app
router.get('/', (req,res)=>{
    res.render('home-page')
})

router.get('/product', (req,res)=>{
    res.render('product-page')
})

router.get('/checkout', (req,res)=>{
    res.render('checkout-page')
})

router.get('/login', (req,res) =>{
    res.render('login')
})

module.exports = router