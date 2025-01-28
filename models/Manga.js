const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MangaSchema = new Schema({
  titulo: {
    type: String,
  },
  capitulo: {
    type: String,
  },
  capa: {
    type: String,
  },
  andamento: {
    type: Boolean,
    default: false
  },
  //Referencia ao usuario
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

module.exports = mongoose.model("Manga", MangaSchema);
