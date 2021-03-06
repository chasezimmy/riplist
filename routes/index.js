var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');


// Render the home page.
router.get('/', function(req, res) {
	res.render('index', { title: 'Home', user: req.user });
});


// Render the registration page.
router.get('/register', function(req, res) {
	res.render('register', { title: 'Register', error: req.flash('error')[0] });
});


// Register a new user to Stormpath.
router.post('/register', function(req, res) {

	var username = req.body.username;
	var password = req.body.password;
	var gender   = req.body.gender;
	var union    = req.body.union;
	var age      = req.body.age;
	var first    = req.body.first;
	var middle   = req.body.middle;
	var last     = req.body.last;


	// Grab user fields.
	if (!username || !password) {
		return res.render('register', { title: 'Register', error: 'Email and password required.' });
	}

	// Initialize our Stormpath client.
	var apiKey = new stormpath.ApiKey(
		process.env['STORMPATH_API_KEY_ID'],
		process.env['STORMPATH_API_KEY_SECRET']
	);
	var spClient = new stormpath.Client({ apiKey: apiKey });

	// Grab our app, then attempt to create this user's account.
	var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
		if (err) throw err;
		console.log(union)

		app.createAccount({
			givenName: first,
			middleName: middle,
			surname: last,
			username: username,
			email: username,
			password: password,
			customData: {
				gender: gender,
				union: union,
				age: age,
			},
		}, function (err, createdAccount) {
			if (err) {
				return res.render('register', {'title': 'Register', error: err.userMessage });
			} else {
				passport.authenticate('stormpath')(req, res, function () {
					return res.redirect('/dashboard');
				});
			}
		});

	});

});


// Render the login page.
router.get('/login', function(req, res) {
	res.render('login', { title: 'Login', error: req.flash('error')[0] });
});


// Logout the user, then redirect to the home page.
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


// Authenticate a user.
router.post(
	'/login',
	passport.authenticate(
		'stormpath',
		{
			successRedirect: '/dashboard',
			failureRedirect: '/login',
			failureFlash: 'Invalid email or password.',
		}
	)
);

router.get('/add_favorite', (req, res) => {
	console.log(req.query.id)
})

// Render the dashboard page.
router.get('/dashboard', function (req, res) {
	if (!req.user || req.user.status !== 'ENABLED') {
		return res.redirect('/login');
	}

	var cursor = db.collection('playbill').find()
	db.collection('playbill').find().toArray(function(err, result) {
		if (err) return console.log(err)





		// renders index.ejs
		res.render('dashboard.ejs', {
			jobs: result,
			user: req.user
		})

	})

 // res.render('dashboard', {
	 // title: 'Dashboard',
	 // user: req.user,
	 // }
 // );
});

module.exports = router;
