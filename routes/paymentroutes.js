const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const payment = require("../models/paymodel");
const product = require("../models/product");
const nodemailer = require("nodemailer");
const async = require("async");
const auth = require("../middleware/auth");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//create a global transport object
let transport = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
};

//cookie middleware
router.use(cookieParser());
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());
//csrf middleware
const csrfProtection = csrf({ cookie: true });

//route for completed payment
router.get("/complete", ensureAuth, (req, res) => {
  const user = req.user;
  if (!req.query.reference) {
    res.redirect("/");
  }
  res.render("payment/payment_complete", {
    user
  });
});

module.exports = router;
