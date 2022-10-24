const crypto = require("crypto");
const { sendEmail } = require("../config/sendgrid");
const User = require("../models/User");
const secret = process.env.PAYSTACK_SECRET;

const validate = async (req, res) => {
  console.log("body", req.body);
  console.log("secret", secret);
  //validate event
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  // check if the user email is in the database

  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    const user = await User.findOne({ email: event.data.customer.email });
    if (user) {
      // if the user is found, send them an email with the payment link
      let substitutions = {
        name: user.firstName,
        amount: event.data.amount,
      };
      await sendEmail(
        "nodeshop@gmail.com",
        "Notice of a Transaction",
        process.env.TRANSACTION_SUCCESS_STATUS,
        substitutions
      );
    }
  }

  res.send(200);
};

module.exports = {
  validate,
};
