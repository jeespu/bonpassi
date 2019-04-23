const mongoose = require("mongoose");

// Schema asetukset
const eventSchema = new mongoose.Schema({
   name: String,
   image: String,
   url: String,
   description: String,
   date: String,
   location: String,
   tickets: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
});

module.exports = mongoose.model("Event", eventSchema);
