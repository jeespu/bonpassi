const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, (req, res) => {
   // Hae Suosikit
   User.findById(req.user._id).populate("favorites").exec((err, user) => {
      if (err) {
         console.log(err);
         res.redirect("back");
      } else {
         //console.log(user.favorites)
         res.render("user/index", { eventData: user.favorites });
      }
   })
})


// Lisää suosikkeihin
router.get("/:id", middleware.isLoggedIn, (req, res) => {
   User.findById(req.user._id, (err, user) => {
      if (err) {
         console.log(err);
         res.redirect("/back");
      } else {
         user.favorites.push(req.params.id);
         console.log(user)
         user.save();
         req.flash("success", "Lisätty Suosikkeihin!")
         res.redirect("/user");
      }
   })
})

// DESTROY – poista tili
router.delete("/:id", middleware.isLoggedIn, (req, res) => {
   User.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
         req.flash("error", "Tilinpoisto epäionnistui");
         res.redirect("back");
      } else
         req.flash("success", "Käyttäjätili poistettu");
      res.redirect("back");
   })
})

module.exports = router;