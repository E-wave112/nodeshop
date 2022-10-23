//route handlers for google auth
const router = require("express").Router();
const passport = require("passport");
const authControllers = require('../controllers/auth');
//intitialize google auth

router.get(
  "/google",
  authControllers.googleAuth()
);

//call back route with /auth/google/callback

router.get(
  "/google/callback",
  authControllers.googleAuthCallback()
);
// Successful authentication, redirect home.

//logout users
router.get("/logout", authControllers.logout);

module.exports = router;
