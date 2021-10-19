const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Univ = new Schema({
  web_pages: { type: Array, default: [] },
  name: { type: String },
  alpha_two_code: { type: String, default: "" },
  domains: { type: Array, default: [] },
  country: { type: String, default: "" },
  "state-province": { type: String, default: "" },
});

module.exports = mongoose.model("Univ", Univ);
