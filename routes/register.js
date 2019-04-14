var express = require('express')
var app = express()

// REGISTRATION FORM
app.get('/', function(req, res, next){	
	// render to views/user/register.ejs
	res.render('user/register', {
		title: 'Register',
		firstname: '',
		lastname: '',
		email: '',
        password: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/register', function(req, res, next){	
	req.assert('firstname', 'Required field').notEmpty()           //Validate name
	req.assert('lastname', 'Required field').notEmpty()             //Validate age
    req.assert('email', 'Required field').isEmail()     //Validate email
    req.assert('password', 'Required field').notEmpty()  //Validate password

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			firstname: req.sanitize('firstname').escape().trim(),
			lastname: req.sanitize('lastname').escape().trim(),
			email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim()
		}
        
        const password = user.password;
        const hashedPassword = bcrypt.hash(password, 8);
		
        console.log(user + hashedPassword);
        
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO user SET ?', user, function(err, result) {
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
					res.render('../views/user/register', {
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
		errors.forEach(function(error) {
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

module.exports = app