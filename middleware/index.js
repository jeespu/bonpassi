const Event = require("../models/event");
const Place = require("../models/place");

// Middleware funktiot
const middlewareObj =
{
   checkEventOwner: function (req, res, next) {
      // Onko käyttäjä kirjautuneena?
      if (req.isAuthenticated()) {
         Event.findById(req.params.id, (err, foundEvent) => {
            if (err) {
               req.flash("error", "Tapahtumaa ei löytynyt");
               res.redirect("back")
            } else {
               // Onko käyttäjällä oikeudet tapahtumaan
               // equals() tarvitaan, koska verrattaan objektia stringiin
               if (foundEvent.author.id.equals(req.user._id)) {
                  next();
               } else {
                  req.flash("error", "Toiminto ei sallittu")
                  res.redirect("back");
               }
            }
         })
      } else {
         req.flash("error", "Sinun tulee kirjautua ensin sisään");
         res.redirect("back"); // palaa takaisin 
      }
   },
   // Onko käyttäjä kirjautunut
   isLoggedIn: function (req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      req.flash("error", "Sinun tulee kirjautua ensin sisään")
      res.redirect("back");
   }
};

module.exports = middlewareObj;