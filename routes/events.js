const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const User = require("../models/user");
const middleware = require("../middleware");

// Index - näytä kaikki tapahtumat
router.get("/", (req, res) => {
   // Get all events from DB
   Event.find({}, (err, allEvents) => {
      if (err)
         console.log(err)
      else
         res.render("events/index", { events: allEvents });
   })
})

// Create - luo tapahtuma
router.post("/", middleware.isLoggedIn, (req, res) => {
   // Hae lomakedata
   let name = req.body.name;
   let image = req.body.image;
   let desc = req.body.description;
   let author = {
      id: req.user._id,
      username: req.user.username
   }
   let newEvent = { name: name, image: image, description: desc, author: author };
   // Lisää ja tallenna tapahtuma databaseen
   Event.create(newEvent, (err, newlyCreated) => {
      if (err)
         console.log(err);
      else
         // Ohjaa tapahtuman sivulle
         console.log(newlyCreated);
      res.redirect("/events/" + newlyCreated._id);
   });
})

// NEW - lomake tapahtuman luontiin
router.get("/new", middleware.isLoggedIn, (req, res) => {
   res.render("events/new");
})

// SHOW - näytä tapahtuman tiedot
router.get("/:id", (req, res) => {
   // Etsi tapahtuma ID:n avulla
   Event.findById(req.params.id, (err, foundEvent) => {
      if (err)
         console.log(err)
      else
         res.render("events/show", { event: foundEvent });
   })
})

// EDIT - muokkaa tapahtumaa
router.get("/:id/edit", middleware.checkEventOwner, (req, res) => {
   Event.findById(req.params.id, (err, foundEvent) => {
      res.render("events/edit", { event: foundEvent });
   });
});

// UPDATE – tallenna muutokset databaseen
router.put("/:id", middleware.checkEventOwner, (req, res) => {
   // find and update the correct event
   // redirect show page
   Event.findByIdAndUpdate(req.params.id, req.body.event, (err, updatedEvent) => {
      if (err) {
         console.log(err)
         res.redirect("/events");
      } else {
         res.redirect("/events/" + req.params.id);
      }
   })
})

// DESTROY – poista tapahtuma
router.delete("/:id", middleware.checkEventOwner, (req, res) => {
   Event.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
         res.redirect("/events");
      } else
         res.redirect("/events");
   })
})


module.exports = router;

