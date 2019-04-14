var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// render to views/index.ejs template file
	res.render('index', {title: 'Jyväskylä-app'})
})

app.post("/login", (req, res) => {
   var sess = req.session;
   // get data from form and add to campgrounds array
   let email = req.body.email;
   let pass = req.body.password;

   let sql="SELECT userid, firstname, lastname, email, profilepicurl FROM `user` WHERE `email`='"+email+"' and password = '"+pass+"'";    
   console.log(sql);
   req.getConnection(function(error, conn) {
      conn.query(sql, function(err, result) {
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

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
