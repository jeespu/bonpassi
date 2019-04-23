const express = require("express"),
   router = express.Router(),
   passport = require("passport"),
   User = require("../models/user"),
   request = require("request"),
   middleware = require("../middleware");

// Root Route
router.get("/", (req, res) => {
   res.render("index");
});

// Rekisteröinti
router.post("/register", (req, res) => {
   let newUser = new User(
      {
         username: req.body.username,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
      });
   User.register(newUser, req.body.password, (err, user) => {
      if (err) {
         req.flash("error", "Käyttäjänimi ei ole vapaana. Kokeile toista nimeä.");
         return res.redirect("back");
      }
      req.flash("success", "Tervetuloa " + newUser.username);
      passport.authenticate("local")(req, res, () => {
         res.redirect("back");
      })
   });
});

// Kirjautuminen
router.post("/login", passport.authenticate("local",
   {
      successRedirect: "back",
      successFlash: 'Tervetuloa!',
      failureRedirect: "back",
      failureFlash: "Väärä käyttäjänimi tai salasana"
   }
));

// Uloskirjautuminen
router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "Kirjauduttu Ulos");
   res.redirect("/");
})

// Paikat
router.get("/places", (req, res) => {
   let urlPlaces = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=places+in+jyväskylä&key=AIzaSyARxi3iKGDqUF6dr1WlHIgx_da-G2yZmvM';
   request(encodeURI(urlPlaces), (error, response, body) => {
      if (!error && response.statusCode === 200) {
         placeData = JSON.parse(body);
         //console.log(placeData)
         res.render("places", { placeData: placeData });
      }
   })
})

// Listaa kaikki käyttäjät
router.get("/users", middleware.isLoggedIn, (req, res) => {
   // Hae kaikki käyttäjät
   User.find({}, (err, allUsers) => {
      if (err) {
         console.log(err)
         res.redirect("back");
      }
      else {
         res.render("user/list", { user: allUsers });
      }
   })
})

module.exports = router;