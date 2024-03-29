const jwt = require("jsonwebtoken");
const Admin = require("../adminModels/admin");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check if jwt exists
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        res.redirect("/admin/login");
      } else {
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
