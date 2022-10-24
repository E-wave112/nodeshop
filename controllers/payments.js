const paymentCompletion = async (req, res) => {
  const user = req.user;
  if (!req.query.reference) {
    res.redirect("/");
  }
  res.render("payment/payment_complete", {
    user,
  });
};

const paymentWebhook = async (req, res) => {
  console.log("body", req.body);
  return res.status(200).json({ data: req.body });
};

module.exports = {
  paymentCompletion,
  paymentWebhook,
};
