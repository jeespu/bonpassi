var express = require('express');
var app = express();
const bcrypt = require('bcryptjs')
app.get('/', function(req, res) {
    if (req.session.user === undefined) {
        // render to views/index.ejs template file
        res.render('index', {
            title: 'Jyväskylä-app'
        });
    } else {
        res.render('index', {
            title: 'Logged in as ' + req.session.user
        });
    }
	
})
app.post("/login", (req, res) => {
	var sess = req.session;
	// get data from login-form
	let email = req.body.email;
	let pass = req.body.password;
	let sql = "SELECT userid, firstname, lastname, email, password, profilepicurl FROM `user` WHERE `email`='" + email + "'";
	//   console.log(sql);
	req.getConnection(function(error, conn) {
		conn.query(sql, function(err, result, fields) {
            console.log(result[0]);
			if (result[0] !== []) {
				const isMatch = bcrypt.compareSync(pass, result[0].password);
				if (isMatch) {
					// render to views/user/add.ejs
					req.session.userId = result[0].userid;
					req.session.user = result[0].firstname;
					res.render('index', {
                        isLoggedIn: true, // Tässä kohti kai välitetään dataa eteenpäin. Voi olla myös että pitää välittää session user jollain tavalla, ja tarkistaa header.ejs:ssä onko sitä olemassa?
						title: 'Logged In as ' + req.session.user
					})
				} else if (err || result.length < 1) {
					req.flash('error', err)
					// render to views/user/add.ejs
					res.render('index', {
						title: 'Error',
					})
				} else {
					res.render('index', {
						title: 'Login incorrect'
					})
				}
			} else {
                console.log(result.toString());
                console.log("Incorrect login credentials.");
                // res.redirect('/');
                res.render('index', {
                    title: 'Incorrect login credentials.'
                });
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
