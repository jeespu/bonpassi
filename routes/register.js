var express = require('express')
var app = express()
const bcrypt = require('bcryptjs');

// REGISTRATION FORM
app.get('/', function (req, res, next) {
   if (req.session.isLoggedIn) {
      res.redirect('/');
   } else {
      // render to views/user/register.ejs
      res.render('user/register', {
         title: 'Register',
         firstname: '',
         lastname: '',
         email: '',
         password: ''
      })
   }
});

app.post('/', async function (req, res, next) {
   req.assert('firstname', 'Required field').notEmpty()           //Validate name
   req.assert('lastname', 'Required field').notEmpty()             //Validate age
   req.assert('email', 'Required field').isEmail()     //Validate email
   req.assert('password', 'Required field').notEmpty()  //Validate password

   var errors = req.validationErrors()
   console.log(errors);

   if (!errors) {   //No errors were found.  Passed Validation!
      var password = req.sanitize('password').escape().trim();
      var hashedPassword = bcrypt.hashSync(password, 8);

      var user = {
         firstname: req.sanitize('firstname').escape().trim(),
         lastname: req.sanitize('lastname').escape().trim(),
         email: req.sanitize('email').escape().trim(),
         password: hashedPassword,
      }

      console.log(user.password);
      let sql = "INSERT INTO `user`(`firstname`,`lastname`, `email`, `password`) VALUES ('" + user.firstname + "','" + user.lastname + "','" + user.email + "','" + hashedPassword + "')";

      req.getConnection(function (error, conn) {
         conn.query(sql, function (err, result) {
            //if(err) throw err
            if (err) {
               req.flash('error', err)

               // render to views/user/add.ejs
               res.render('user/register', {
                  title: 'Register',
                  name: user.name,
                  age: user.age,
                  email: user.email,
                  password: hashedPassword
               })
            } else {
               req.flash('success', 'Data added successfully!')

               // render to views/user/add.ejs
               res.render('index', {
                  title: 'Register',
                  name: '',
                  age: '',
                  email: '',
                  password: '',
                  meteli: metelii.event,
                  news: news.headline
               })
            }
         })
      })
   }
})

module.exports = app