const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


router.use(cookieParser());
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());


//route for completed payment
router.get("/complete", ensureAuth, (req, res) => {
  const user = req.user;
  if (!req.query.reference) {
    res.redirect("/");
  }
  res.render("payment/payment_complete", {
    user,
  });
});

router.post("/complete-transaction", ensureAuth, (req, res) => {
  console.log("body", req.body);
  return res.status(200).json({ data: req.body });
});

module.exports = router;
