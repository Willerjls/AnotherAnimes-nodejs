const express = require("express");
const mongoose = require("mongoose");
require("../models/Salvo");
require("../models/Usuario");
const Salvo = mongoose.model("Salvo");
const Usuario = mongoose.model("Usuario");
const { logado } = require("../helpers/logado");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define a pasta onde os arquivos temporários serão armazenados
const cloudinary = require('cloudinary').v2;


// Rotas

// rota de acesso a salvos
router.get("/salvos", logado, (req, res) => {
  // var usuario = req.session.user;
  Salvo.find({ usuario: req.user })
    .then((salvos) => {

      res.render("salvo/salvos", { salvos: salvos });
    })
    .catch((err) => {
      req.flash("error_mgs", "Não foi possivel carregar");
    });
});

// rota de acesso ao Adicionar
router.get("/adicionar", logado, (req, res) => {
  Usuario.find()
    .then((usuario) => {
      res.render("salvo/adicionar", { usuario: usuario });
      var usuario = req.session.usuario;
    })
    .catch((err) => {
      req.flash("error_mgs", "Ocorreu um erro ao carregar");
      res.redirect("/");
    });
});

// rota de lancamento de dados
router.post('/adicionar/add', logado, upload.single('imagem'), async (req, res) => {
  try {
    // Primeiro, faça o upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // A URL da imagem está em result.secure_url
    const imageUrl = result.secure_url;

    const novoAnime = {
      usuario: req.body.usuario,
      titulo: req.body.titulo,
      temporada: req.body.temporada,
      episodio: req.body.episodio,
      imagem: imageUrl, // Use a URL da imagem do Cloudinary aqui
    };

    new Salvo(novoAnime)
      .save()
      .then(() => {
        res.redirect('/salvo/salvos');
      })
      .catch((err) => {
        res.redirect('/salvo/adicionar');
        req.flash('error_msg', 'Ocorreu um erro ao carregar');
      });
  } catch (error) {
    console.error(error);
    res.redirect('/salvo/adicionar');
    req.flash('error_msg', 'Ocorreu um erro ao fazer o upload da imagem');
  }
});


// Rota de acessar edição
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

router.post("/salvos/edit", logado, upload.single('imagem'), async(req, res) => {
 // Primeiro, faça o upload da nova imagem para o Cloudinary
cloudinary.uploader.upload(req.file.path, (error, result) => {
  if (error) {
    console.error('Erro ao fazer upload da nova imagem:', error);
    req.flash("error_mgs", "Não foi possível fazer o upload da imagem");
    res.redirect("/salvo/salvos");
  } else {
    // A URL da imagem está em result.secure_url
    const imageUrl = result.secure_url;

    Salvo.findOne({ _id: req.body.id }).then((salvo) => {
      (salvo.titulo = req.body.titulo),
      (salvo.episodio = req.body.episodio),
      (salvo.temporada = req.body.temporada),
      (salvo.imagem = imageUrl); // Atualize o imageUrl com a nova URL do Cloudinary
      salvo
        .save()
        .then(() => {
          req.flash("success_mgs", "Atualizado com sucesso");
          res.redirect("/salvo/salvos");
        })
        .catch((err) => {
          console.error('Erro ao salvar objeto Salvo:', err);
          req.flash("error_mgs", "Não foi possível atualizar o objeto Salvo");
          res.redirect("/salvo/salvos");
        });
    }).catch((err) => {
      console.error('Erro ao encontrar objeto Salvo:', err);
      req.flash("error_mgs", "Não foi possível encontrar o objeto Salvo");
      res.redirect("/salvo/salvos");
    });
  }
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
