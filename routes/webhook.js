const router = require("express").Router();
const crypto = require("crypto");
const User = require("../models/User");
const secret = process.env.PAYSTACK_SECRET;
const { sendEmail } = require("../config/sendgrid");
const { validate } = require("../controllers/webhook");

// Using Express
router.post("/validate", validate);

module.exports = router;
