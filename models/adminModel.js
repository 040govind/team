const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  content: {
    type: String,
  },
});

module.exports = mongoose.model("News", newsSchema);