var express = require('express')
var app = express()
var fs = require('fs')
var meteli = require('../public/json/meteli.json')
var menoinfo = require('../public/json/menoinfo.json')
var Fuse = require('fuse.js')

app.get('/', async function(req, res, next) {
    // Places search
	var googleMapsClient = require('@google/maps').createClient({
		key: 'AIzaSyARxi3iKGDqUF6dr1WlHIgx_da-G2yZmvM'
	});
	const jkl = [62.242561, 25.747499];
	googleMapsClient.places({
		query: req.query.keyword,
		location: jkl,
		radius: 5000,
		language: 'fi',
        pagetoken: ""
	}, async function(err, response) {
		if (!err) {
			response.json.results.forEach(function(result) {
				switch (result.types[0]) {
					case 'night_club':
						result.types[0] = 'Yökerho';
						return;
					case 'bar':
						result.types[0] = 'Baari';
						return;
					case 'restaurant':
						result.types[0] = 'Ravintola';
						return;
					case 'cafe':
						result.types[0] = 'Kahvila';
						return;
				}
			})
            
            var events = meteli.event.concat(menoinfo.event);
            
            // Event search
            var options = {
              shouldSort: true,
              threshold: 0.2,
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
            };
            var fuse = new Fuse(events, options); // "list" is the item array
            var eventResult = fuse.search(req.query.keyword);
            
            res.render('searchresults', {
                eventResult: eventResult,
				results: response.json.results,
				loggedUser: req.session.loggedUser,
                isLoggedIn: req.session.isLoggedIn,
				title: "Tulokset haulla " + req.query.keyword
			})
		}
	});
})

module.exports = app