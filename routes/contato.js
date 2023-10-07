const express = require("express");
const mongoose = require("mongoose");
require("../models/Contato");
const Contato = mongoose.model("Contato");
const router = express.Router();


router.get("/contato", (req, res) => {
  res.render("contato/contato");
});

// rota de lancamento de dados
router.post('/contato/add', (req, res) => {
  const novoMensagem = {
    nome: req.body.nome,
    email: req.body.email,
    mensagem: req.body.mensagem,
  };

  new Contato(novoMensagem)
    .save()
    .then(() => {
      req.flash('modal_mgs', 'Sua mensagem foi enviada com sucesso, em breve te responderemos');
      res.redirect('/');
    })
    .catch((err) => {
      // res.redirect('/contato');
      req.flash('error_msg', 'Ocorreu um erro ao enviar sua mensagem');
    });
});

module.exports = router;