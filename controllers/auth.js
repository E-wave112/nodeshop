const logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

module.exports = {
  logout,
};
