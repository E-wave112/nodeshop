//route handlers for google auth
const router = require("express").Router();
const passport = require("passport");
const authControllers = require("../controllers/auth");
//intitialize google auth

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

//call back route with /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
// Successful authentication, redirect home.

//logout users
router.get("/logout", authControllers.logout);

module.exports = router;
