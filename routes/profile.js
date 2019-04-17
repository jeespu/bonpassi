var express = require('express')
var app = express()

app.get('/', function (req, res, next) {
    if (!req.session.isLoggedIn) {
res.redirect('/');
    } else {
       // render to views/user/profile.ejs
       res.render('user/profile', {
           title: "Profiilisi",
           isLoggedIn: req.session.isLoggedIn,
           loggedUser: req.session.loggedUser
       })
    }
});

module.exports = app