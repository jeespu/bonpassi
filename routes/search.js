var express = require('express')
var app = express()

app.get('/', function (req, res, next) {
    var keyword = req.body.keyword;
   // render to views/user/register.ejs
   res.render('searchresults', {
       isLoggedIn: req.session.isLoggedIn,
       title: 'Hakutulokset kohteelle ' + req.query.keyword,
       keyword: req.query.keyword
   })
});

module.exports = app