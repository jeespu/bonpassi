var mysql = require('mysql');
var JAWSDB_URL = 'mysql://rkhs71ydpn11g37c:zauyntbmzwxhi29l@q7cxv1zwcdlw7699.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/fg62ry4ik09ydqu1'
try {
    var connection = mysql.createConnection(JAWSDB_URL);
    console.log("Connection succesful!")
}
catch (e) {
    console.log("Connection unsuccesful")
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000
app.listen(port, () => {
console.log('Server is up on port ' + port)
})

module.exports = app;


