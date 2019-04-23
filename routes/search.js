const express = require("express"),
   router = express.Router(),
   passport = require("passport"),
   request = require("request"),
   Fuse = require("fuse.js"),
   User = require("../models/user");

// Haku
let query;
let placeData;
let options = {
   shouldSort: true,
   threshold: 0.3,
   location: 0,
   distance: 100,
   maxPatternLength: 32,
   minMatchCharLength: 1,
   keys: [
      "name",
      "address",
      "location",
      "venue",
      "date",
      "url",
      "category"
   ]
};

router.get("/", (req, res) => {
   if (!placeData) { res.redirect("back") }
   // Get all events from DB
   Event.find({}, (err, allEvents) => {
      if (err)
         console.log(err)
      else {
         //console.log(allEvents)
         let fuse = new Fuse(allEvents, options);
         let foundEvents = fuse.search(query);
         res.render("search", { placeData: placeData, eventData: foundEvents, query: query });
      }
   })
})

router.post('/', (req, res) => {
   query = req.body.query;
   let urlPlaces = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + query + '+in+jyväskylä&key=AIzaSyARxi3iKGDqUF6dr1WlHIgx_da-G2yZmvM';
   request(encodeURI(urlPlaces), (error, response, body) => {
      if (!error && response.statusCode === 200) {
         placeData = JSON.parse(body);
         res.redirect('/search');
      }
   })
})

module.exports = router;