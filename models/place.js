const mongoose = require("mongoose");

// Schema asetukset
const placeSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
});

module.exports = mongoose.model("Place", placeSchema);
