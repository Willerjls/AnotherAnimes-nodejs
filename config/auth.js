const express = require("express");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require('passport');
const { logado } = require("../helpers/logado");

// Model Usuario importação
require("../models/Usuario");
const Usuario = mongoose.model("Usuario");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "senha" },
      (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
          if (!usuario) {
            return done(null, false, {
              message: "Está conta não existe!",
            });
          }
          bcrypt.compare(senha, usuario.senha, (erro, batem) => {
            if (batem) {
              return done(null, usuario);
            } else {
              return done(null, false, {
                message: "Senha incorreta!",
              });
            }
          });
        });
      }
    )
  );
};


passport.serializeUser((usuario, done) => {
  done(null, usuario.id)
})

passport.deserializeUser((id, done) => {
  Usuario.findById(id, (err, usuario) => {
    done(err,usuario)
  })
})

// Salvando dados na seção
router.post('/salvos', (req, res) => {
  req.session.userId = req.usuario.id;
  req.flash("success_mgs", 'Bem-vindo, ' + Usuario.nome + '!');
});

