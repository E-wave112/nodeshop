const router = require("express").Router();
const { validate } = require("../controllers/webhook");

// Using Express
router.post("/validate", validate);

module.exports = router;
