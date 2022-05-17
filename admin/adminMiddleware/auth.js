const jwt = require("jsonwebtoken");
const Admin = require("../adminModels/admin");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check if jwt exists
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        //console.log(err.message)
        res.redirect("/admin/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/admin/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await Admin.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
