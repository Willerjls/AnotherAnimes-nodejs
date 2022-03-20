const express = require("express");
const mongoose = require("mongoose");
require("../models/Salvo");
require("../models/Usuario");
const Salvo = mongoose.model("Salvo");
const Usuario = mongoose.model("Usuario");
const { logado } = require("../helpers/logado");
const router = express.Router();

// Rotas
router.get("/salvos", logado, (req, res) => {
  Salvo.find()
    .then((salvos) => {
      res.render("salvo/salvos", { salvos: salvos });
    })
    .catch((err) => {
      req.flash("error_mgs", "Não foi possivel carregar");
    });
});

router.get("/adicionar", logado, (req, res) => {
  Usuario.find()
    .then((usuario) => {
      res.render("salvo/adicionar", { usuario: usuario });
    })
    .catch((err) => {
      req.flash("error_mgs", "Ocorreu um erro ao carregar");
      res.redirect("/");
    });
});

router.post("/adicionar/add", logado, (req, res) => {
  const novoAnime = {
    usuario: req.body.usuario,
    titulo: req.body.titulo,
    temporada: req.body.temporada,
    episodio: req.body.episodio,
    imagem: req.body.imagem,
  };

  new Salvo(novoAnime)
    .save()
    .then(() => {
      req.flash("success_mgs", "Tudo salvo amiguinho");
      res.redirect("/salvo/salvos");
    })
    .catch((err) => {
      res.flash("error_mgs", "Ocorreu um erro");
      res.redirect("/salvo/adicionar");
    });
});

router.get("/salvos/edit/:id", logado, (req, res) => {
  Salvo.findOne({ _id: req.params.id })
    .then((salvo) => {
      res.render("salvo/editar", { salvo: salvo });
    })
    .catch((err) => {
      req.flash("error_mgs", "Ocorreu um erro tente novamente");
      res.redirect("/salvo/salvos");
    });
});

router.post("/salvos/edit", logado, (req, res) => {
  Salvo.findOne({ _id: req.body.id }).then((salvo) => {
    (salvo.titulo = req.body.titulo),
      (salvo.episodio = req.body.episodio),
      (salvo.temporada = req.body.temporada),
      (salvo.imagem = req.body.imagem);
    salvo
      .save()
      .then(() => {
        req.flash("success_mgs", "Atualizado com sucesso");
        res.redirect("/salvo/salvos");
      })
      .catch((err) => {
        req.flash("error_mgs", "Não foi possivel atualizar");
        res.redirect("/salvo/salvos");
      });
  });
});

router.post("/salvos/deletar", logado, (req, res) => {
  Salvo.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_mgs", "Excluido com sucesso");
      res.redirect("/salvo/salvos");
    })
    .catch((err) => {
      req.flash("error_mgs", "Ocorreu um erro ao excluir");
      res.redirect("/salvo/salvos");
    });
});

module.exports = router;
