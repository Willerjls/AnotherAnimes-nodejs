const express = require("express");
const mongoose = require("mongoose");
require("../models/Manga");
require("../models/Usuario");
const Salvo = mongoose.model("Manga");
const Usuario = mongoose.model("Usuario");
const { logado } = require("../helpers/logado");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define a pasta onde os arquivos temporários serão armazenados
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const cloudinaryUpload = promisify(cloudinary.uploader.upload);

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
  } catch (err) {
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


router.post('/salvos/edit', logado, upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Nenhuma imagem foi enviada');
    }

    // Primeiro, faça o upload da nova imagem para o Cloudinary
    const result = await cloudinaryUpload(req.file.path);

    // A URL da nova imagem está em result.secure_url
    const novaImageUrl = result.secure_url;

    // Encontre o documento Salvo pelo ID
    const salvo = await Salvo.findOne({ _id: req.body.id });

    if (!salvo) {
      throw new Error('Registro não encontrado');
    }

    // Excluir a imagem anterior do Cloudinary, se houver uma imagem anterior
    if (salvo.imagem) {
      const publicIdAntigo = salvo.imagem.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicIdAntigo);
    }

    // Atualize o campo imagem com a nova URL do Cloudinary
    salvo.titulo = req.body.titulo;
    salvo.episodio = req.body.episodio;
    salvo.temporada = req.body.temporada;
    salvo.imagem = novaImageUrl;

    // Salve as alterações no documento Salvo
    await salvo.save();

    req.flash('success_mgs', 'Atualizado com sucesso');
    res.redirect('/salvo/salvos');
  } catch (error) {
    console.error('Erro:', error.message);
    req.flash('error_mgs', 'Ocorreu um erro ao atualizar');
    res.redirect('/salvo/salvos');
  }
});


router.post('/salvos/deletar', logado, (req, res) => {
  // Encontre o documento Salvo pelo ID
  Salvo.findOne({ _id: req.body.id })
    .then((salvo) => {
      if (!salvo) {
        req.flash('error_mgs', 'Registro não encontrado');
        return res.redirect('/salvo/salvos');
      }

      // Extrai o public_id da URL da imagem (supondo que sua URL seja algo como "https://res.cloudinary.com/sua_cloud_name/image/upload/public_id.jpg")
      const publicId = salvo.imagem.split('/').pop().split('.')[0];

      // Excluir a imagem do Cloudinary
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Erro ao excluir imagem do Cloudinary:', error);
        } else {
          console.log('Imagem excluída com sucesso do Cloudinary:', result);
        }
      });

      // Remova o documento Salvo do banco de dados
      return salvo.remove();
    })
    .then(() => {
      req.flash('success_mgs', 'Excluído com sucesso');
      res.redirect('/salvo/salvos');
    })
    .catch((err) => {
      req.flash('error_mgs', 'Ocorreu um erro ao excluir');
      res.redirect('/salvo/salvos');
    });
});

module.exports = router;
