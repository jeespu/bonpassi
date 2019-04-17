var express = require('express')
var app = express()
var fs = require('fs')
var meteli = require('../public/json/meteli.json')
const JsSearch = require('js-search')

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
            
            // Events search
            var search = new JsSearch.Search('event');
            search.addIndex('name');
            search.addIndex('venue');
            search.addIndex('date');
            search.addDocuments(meteli.event);
            var meteliResult = search.search(req.query.keyword);
            
            res.render('searchresults', {
                meteliResult: meteliResult,
				results: response.json.results,
				isLoggedIn: req.session.isLoggedIn,
				profilePic: req.session.profilePic,
				userId: req.session.userId,
				isAdmin: req.session.isAdmin,
				title: "Tulokset haulla " + req.query.keyword
			})
		}
	});
})
//const { NominatimJS } = require('nominatim-js');
//app.get('/', function(req, res, next) {
//	NominatimJS.search({ // Paikkahaku (ravintolat yms)
//		q: req.query.keyword + ' jyväskylä suomi', // Haetaan vaan Jyväskylästä :)
//        limit: 50
//	}).then(results => { // Löydettiin tuloksia
//        console.log(results[0].display_name.split(',')[0]); // Tuolla rimpsulla saa pelkän paikan nimen
//        results.forEach(function(place) {
//            place.address = place.display_name.split(',')[2] + place.display_name.split(',')[1]; // Paljon korjailtavaa
//            place.display_name = place.display_name.split(',')[0];
//            console.log(place.address);
//        })
//        // Parsetaan paikkahaun tulokset
//        const parsedPlaceResults = {
//            // Jotain forEach höttöä?
//        }
//        // Haetaan tapahtumia ...
//        // Jos löytyy, nekin parsetaan
//        const parsedEventResults = {
//            // Jotain forEach höttöä?
//        }
//        // Yhdistetään parsetut tulokset muuttujaan "allResults"
//        const allResults = results; // <- Placeholderi, 
//		res.render('searchresults', { // Välitetään tulokset searchresults-näkymälle
//			isLoggedIn: req.session.isLoggedIn,
//			title: 'Hakutulokset kohteelle ' + req.query.keyword,
//			results: allResults // searchresults-näkymä ottaa sisään resultsin, joka on siis ylempänä määritelty allResults
//		})
//	}).catch(error => {
//		res.render('searchresults', {
//            isLoggedIn: req.session.isLoggedIn,
//            title: 'Ei hakutuloksia'
//        })
//	})
//});

module.exports = app