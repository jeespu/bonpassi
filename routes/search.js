var express = require('express')
var app = express()
const { NominatimJS } = require('nominatim-js');

app.get('/', function(req, res, next) {
	NominatimJS.search({ // Paikkahaku (ravintolat yms)
		q: req.query.keyword + ' jyväskylä suomi', // Haetaan vaan Jyväskylästä :)
        limit: 50
	}).then(results => { // Löydettiin tuloksia
        console.log(results[0].display_name.split(',')[0]); // Tuolla rimpsulla saa pelkän paikan nimen
        results.forEach(function(place) {
            place.address = place.display_name.split(',')[2] + place.display_name.split(',')[1]; // Paljon korjailtavaa
            place.display_name = place.display_name.split(',')[0];
            console.log(place.address);
        })
        // Parsetaan paikkahaun tulokset
        const parsedPlaceResults = {
            // Jotain forEach höttöä?
        }
        // Haetaan tapahtumia ...
        // Jos löytyy, nekin parsetaan
        const parsedEventResults = {
            // Jotain forEach höttöä?
        }
        // Yhdistetään parsetut tulokset muuttujaan "allResults"
        const allResults = results; // <- Placeholderi, 
		res.render('searchresults', { // Välitetään tulokset searchresults-näkymälle
			isLoggedIn: req.session.isLoggedIn,
			title: 'Hakutulokset kohteelle ' + req.query.keyword,
			results: allResults // searchresults-näkymä ottaa sisään resultsin, joka on siis ylempänä määritelty allResults
		})
	}).catch(error => {
		res.render('searchresults', {
            isLoggedIn: req.session.isLoggedIn,
            title: 'Ei hakutuloksia'
        })
	})
});

module.exports = app