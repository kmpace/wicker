var Firebase = require('firebase');
var crypto = require('crypto');

var firebase = new Firebase('https://wicker-tuts-d8738.firebaseio.com/');


var users = firebase.child('users');

function hash (password) {
	return crypto.createHash('sha512').update(password).digest('hex');
}






var router = require('express').Router();

router.use(require('body-parser').json());

router.use(require('cookie-parser')());

router.use(require('express-session')({
	resave: false,
	saveUninitialized: true,
	secret: 'askldjkijsdadjiasjd'


}));

//Sign Up Proscess
router.post('/api/signup', function(req,res){
	var username = req.body.username,
	password = req.body.password;


	if (!username || !password)
		return res.json({ signedIn: false, message: 'no username or passord'});

	users.child(username).once('value'), function (snapshot) {
		if (snapshot.exists())
			return res.json({ signedIn: false, message: 'username already in use'});

			var userObj = {
				username: username,
				passwordHash: hash(password)


			};

		users.child(username).set(userObj);
		req.session.user = userObj;

		res.json({	
			signedIn: true,
			user: userObj_
		})

	});


});


router.post('/api/signin', function(req, res){
	var username = req.body.username,
	password = req.body.password;


	if (!username || !password)
		return res.json({ signedIn: false, message: 'no username or passord'});


	users.child(username).once('value', function(snapshot){
		if (!snapshot.exists() || snapshot.child('passwordHash_').val() !== hash(password))
			return res.json({ signedIn: false, message 'wrong username or password' });

		var users = snapshot.exportVal();

		req.session.user = user;
		res.json({
			signedIn: true,
			user: user

		});

	});
});

router.post('api/signout', function (req, res) {
	delete req.session.user;
	res.json({
		signedIn: false,
		message: 'You have been signed out'

	});

}); 

module.exports = router; 