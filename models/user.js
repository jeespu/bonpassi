const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
   username: String,
   password: String,
   firstName: String,
   lastName: String,
   email: String,
   favorites: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Event"
      }
   ],
   isAdmin: Boolean,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);