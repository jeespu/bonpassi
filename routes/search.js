var express = require('express');
var app = express();
var fs = require('fs');
var meteli = require('../public/json/meteli.json');
var menoinfo = require('../public/json/menoinfo.json');
var Fuse = require('fuse.js');
var request = require('request');

let query;
let placeData;
let eventData;
let options = {
   shouldSort: true,
   threshold: 0.6,
   location: 0,
   distance: 100,
   maxPatternLength: 32,
   minMatchCharLength: 1,
   keys: [
      "name",
      "address",
      "venue",
      "date",
      "url",
      "category"
   ]
}

// Bailataan Jyväskylä events
let urlEvents = 'https://www.parsehub.com/api/v2/runs/tpVAisiDpyEj/data?api_key=tzO4YZDoS3MH';
// Data encoodattu gzip-muotoon
request(urlEvents, { gzip: true }, (error, response, body) => {
   if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);
      // Yhdistetään JSONit
      eventData = Object.assign(meteli.event, menoinfo.event, data.events);
   }
})

app.get('/', (req, res) => {
   let fuse = new Fuse(eventData, options);
   let foundEvents = fuse.search(query);
   res.render("searchresults", { title: "Tulokset haulla " + query, placeData: placeData, eventData: foundEvents });
})

app.post('/', (req, res) => {
   query = req.body.query;
   let urlPlaces = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + query + '+in+jyvaskyla&key=AIzaSyARxi3iKGDqUF6dr1WlHIgx_da-G2yZmvM';
   request(urlPlaces, (error, response, body) => {
      if (!error && response.statusCode === 200) {
         placeData = JSON.parse(body);
         res.redirect('/search');
      }
   })
})

// app.get('/', async function(req, res, next) {
//     // Places search
// 	var googleMapsClient = require('@google/maps').createClient({
// 		key: 'AIzaSyARxi3iKGDqUF6dr1WlHIgx_da-G2yZmvM'
// 	});
// 	const jkl = [62.242561, 25.747499];
// 	googleMapsClient.places({
// 		query: req.query.keyword,
// 		location: jkl,
// 		radius: 5000,
// 		language: 'fi',
//         pagetoken: ""
// 	}, async function(err, response) {
// 		if (!err) {
// 			response.json.results.forEach(function(result) {
// 				switch (result.types[0]) {
// 					case 'night_club':
// 						result.types[0] = 'Yökerho';
// 						return;
// 					case 'bar':
// 						result.types[0] = 'Baari';
// 						return;
// 					case 'restaurant':
// 						result.types[0] = 'Ravintola';
// 						return;
// 					case 'cafe':
// 						result.types[0] = 'Kahvila';
// 						return;
// 				}
// 			})

//             var events = meteli.event.concat(menoinfo.event);

//             // Event search
//             var options = {
//               shouldSort: true,
//               threshold: 0.2,
//               location: 0,
//               distance: 100,
//               maxPatternLength: 32,
//               minMatchCharLength: 1,
//               keys: [
//                 "name",
//                 "address",
//                 "venue",
//                 "date",
//                 "url",
//                 "category"
//               ]
//             };
//             var fuse = new Fuse(events, options); // "list" is the item array
//             var eventResult = fuse.search(req.query.keyword);

//             res.render('searchresults', {
//                 eventResult: eventResult,
// 				results: response.json.results,
// 				loggedUser: req.session.loggedUser,
//                 isLoggedIn: req.session.isLoggedIn,
// 				title: "Tulokset haulla " + req.query.keyword
// 			})
// 		}
// 	});
// })

module.exports = app