const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UniUser = new Schema({
  email: { type: String },
  password: { type: String },
  favoriteUniversity: { type: Array, default: [] },
});

module.exports = mongoose.model("UniUser", UniUser);
