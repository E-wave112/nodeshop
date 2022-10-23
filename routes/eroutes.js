//intialize express routers
const router = require("express").Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { ensureAuth } = require("../middleware/auth");
const product = require("../models/product");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("../utils/multer");
const payment = require("../models/paymodel");
const axios = require("axios");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { requireAuth } = require("../admin/adminMiddleware/auth");
const productControllers = require('../controllers/econtrollers');
// const exchangeRate = require('../utils/currency_conv');

// error handler
router.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") {
    // handle CSRF token errors here
    res.status(403);
    res.render("error/403");
    return next(err);
  }
});
//cookie parser middleware
router.use(cookieParser());

//body parser middleware
const parseForm = bodyParser.urlencoded({ extended: true });

//csrf middleware
const csrfProtection = csrf({ cookie: true });

router.get("/", productControllers.getAllProducts);

//filter products by category
router.get("/category", productControllers.filterProductsByCategory);

//get  product details
router.get("/product/:id", ensureAuth, csrfProtection, productControllers.getProductById);

//post request for payment
router.post(
  "/product/:id",
  ensureAuth,
  csrfProtection,
  parseForm,
  productControllers.productPaymentById
);

//get the link to add a product to the eccomerce application using a GET request
router.get(
  "/add-product",
  ensureAuth,
  requireAuth,
  csrfProtection,
  productControllers.addProductGet
);

//post the filled form
router.post(
  "/add-product",
  upload.single("image"),
  ensureAuth,
  requireAuth,
  parseForm,
  csrfProtection,
  productControllers.addProductPost
);

router.get("/login", productControllers.login);

module.exports = router;
