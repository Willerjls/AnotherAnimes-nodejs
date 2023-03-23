module.exports = {
  logado: function (req, res, next) {
    if (req.isAuthenticated() && req.user.logado == 0) {
      return next();
    }
    // req.flash("error_mgs", "Você precisa entrar para salvar")
    res.redirect("/usuario/login")
  }
}