module.exports = {
  logado: function (req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.id ) {
      return next();
    }
    res.redirect("/usuario/login")
  }


}

