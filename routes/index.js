var express = require('express');
var app = express();
const bcrypt = require('bcryptjs');

app.get('/', function (req, res) {
   // render to views/index.ejs template file
   res.render('index', { title: 'Jyväskylä-app' })
})

app.post("/login", (req, res) => {
   var sess = req.session;
   // get data from login-form
   let email = req.body.email;
   let pass = req.body.password;

   let sql = "SELECT userid, firstname, lastname, email, profilepicurl FROM `user` WHERE `email`='" + email + "' and password = '" + pass + "'";
   console.log(sql);
   req.getConnection(function (error, conn) {
      conn.query(sql, function (err, result) {
         console.log(result);
         //if(err) throw err
         if (err || result.length < 1) {
            req.flash('error', err)
            // render to views/user/add.ejs
            res.render('index', {
               title: 'Login incorrect',
            })
         } else {
            // render to views/user/add.ejs
            req.session.userId = result[0].userid;
            req.session.user = result[0].firstname;
            res.render('index', {
               title: 'Logged In as ' + req.session.user,
            })
         }
      })
   })

})

app.post('/register', function (req, res, next) {
   req.assert('firstname', 'Required field').notEmpty()           //Validate name
   req.assert('lastname', 'Required field').notEmpty()             //Validate age
   req.assert('email', 'Required field').isEmail()     //Validate email
   req.assert('password', 'Required field').notEmpty()  //Validate password

   var errors = req.validationErrors()
   console.log(errors);

   if (!errors) {   //No errors were found.  Passed Validation!

      /********************************************
       * Express-validator module
       
      req.body.comment = 'a <span>comment</span>';
      req.body.username = '   a user    ';
 
      req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
      req.sanitize('username').trim(); // returns 'a user'
      ********************************************/
      // const password = req.sanitize('password').escape().trim();
      // const hashedPassword = bcrypt.hash(password, 8);

      var user = {
         firstname: req.sanitize('firstname').escape().trim(),
         lastname: req.sanitize('lastname').escape().trim(),
         email: req.sanitize('email').escape().trim(),
         password: req.sanitize('password').escape().trim(),
      }

      console.log(user.password);
      let sql = "INSERT INTO `user`(`firstname`,`lastname`, `email`, `password`) VALUES ('" + user.firstname + "','" + user.lastname + "','" + user.email + "','" + user.password + "')";

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
                  password: ''
               })
            }
         })
      })
   }
   else {   //Display errors to user
      var error_msg = ''
      errors.forEach(function (error) {
         error_msg += error.msg + '<br>'
      })
      req.flash('error', error_msg)

      /**
       * Using req.body.name 
       * because req.param('name') is deprecated
       */
      res.render('user/register', {
         title: 'Add New User',
         name: req.body.name,
         age: req.body.age,
         email: req.body.email,
         password: req.body.password
      })
   }
})

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */
module.exports = app;
