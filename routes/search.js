var express = require('express')
var app = express()

app.get('/', function (req, res, next) {
   // render to views/user/register.ejs
   res.render('searchresults', {
       isLoggedIn: req.session.isLoggedIn,
      title: 'Search results'
   })
});

module.exports = app