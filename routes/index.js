var express = require('express');
var app = express();
const bcrypt = require('bcryptjs')

app.get('/', function(req, res) {
    
	if (req.session.isLoggedIn === undefined) {
		res.render('index', {
			title: 'Tervetuloa, vieras',
		});
	} else {
		res.render('index', {
            isLoggedIn: req.session.isLoggedIn,
            loggedUser: req.session.loggedUser,
			title: 'Tervetuloa takaisin, ' + req.session.loggedUser.firstName
		});
	}
})

app.post("/login", (req, res) => {
	// get data from login-form
	let email = req.body.email;
	let pass = req.body.password;
	let sql = "SELECT userid, firstname, lastname, email, password, profilepicurl, admin FROM `user` WHERE `email`='" + email + "'";
	//   console.log(sql);
	req.getConnection(function(error, conn) {
		conn.query(sql, function(err, result, fields) {
			//console.log(result[0]);
			if (result[0] !== []) {
				const isMatch = bcrypt.compareSync(pass, result[0].password);
				if (isMatch) {
//					req.session.userId = result[0].userid;
//					req.session.user = result[0].firstname;
//                    req.session.firstname = result[0].firstname;
//                    req.session.lastname = result[0].lastname;
//                    req.session.email = result[0].email;
//                    req.session.isAdmin = result[0].admin;
                    req.session.isLoggedIn = true;
                    if (result[0].profilepicurl !== null) {
                        req.session.profilePic = result[0].profilepicurl;
                    } else {
                        req.session.profilePic = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png'
                    }
					
                    req.session.loggedUser = { // Wrappaa kaikki sessiomuuttujat tähän
                        userId: result[0].userid,
                        firstName: result[0].firstname,
                        lastName: result[0].lastname,
                        email: result[0].email,
                        isAdmin: result[0].admin,
                        profilePic: req.session.profilePic
                    }
					res.render('index', {
                        loggedUser: req.session.loggedUser,
						title: "Tervetuloa takaisin, " + req.session.loggedUser.firstName,
						isLoggedIn: req.session.isLoggedIn
//                        userId: req.session.userId,
//                        isAdmin: req.session.isAdmin,
//                        profilePic: req.session.profilePic,
					})
				} else if (err || result.length < 1) {
					req.flash('error', err)
					res.render('index', {
						title: 'Error',
					})
				} else {
					res.render('index', {
						title: 'Login incorrect',
					})
				}
			} else {
				console.log(result.toString());
				console.log("Incorrect login credentials.");
				// res.redirect('/');
				res.render('index', {
					title: 'Incorrect login credentials.',
				});
			}
		})
	})
})
app.get('/logout', function(req, res) {
	req.session = req.session.destroy();
	res.render('index', {
		title: 'Näkemiin!',
	});
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