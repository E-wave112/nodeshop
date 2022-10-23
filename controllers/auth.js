const passport = require("passport");
//intitialize google auth

const googleAuth = () => {
    return passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      })
}

const googleAuthCallback = () => {
    return passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/");
    }
}

const logout = (req,res) => {
    req.logout();
    res.redirect("/login");
}

module.exports = {
    googleAuth,
    googleAuthCallback,
    logout
}
