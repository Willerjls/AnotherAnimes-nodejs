if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://jaquelineuser:<password>@anotherdb.uxvea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/anotheranimes"
  }
}