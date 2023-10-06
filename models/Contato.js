const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContatoSchema = new Schema({
  nome: {
    type: String,
  },
  email: {
    type: String,
  },
  mensagem: {
    type: String,
  }
});

module.exports = mongoose.model("Contato", ContatoSchema);
