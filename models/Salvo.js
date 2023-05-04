const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalvoSchema = new Schema({
  titulo: {
    type: String,
  },
  temporada: {
    type: String,
  },
  episodio: {
    type: String,
  },
  imagem: {
    type: String,
  },
  //Referencia ao usuario
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

module.exports = mongoose.model("Salvo", SalvoSchema);
