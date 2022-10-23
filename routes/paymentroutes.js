const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const paymentControllers = require('../controllers/payments');


router.use(cookieParser());
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());


//route for completed payment
router.get("/complete", ensureAuth, paymentControllers.paymentCompletion);

router.post("/complete-transaction", ensureAuth, paymentControllers.paymentWebhook);

module.exports = router;
