const express = require('express');
const userController = require('../controllers/user');
const { verify, isLoggedIn } = require("../auth");
const router = express.Router();
const passport = require('passport');

// this route expects a POST method at the URI "/check-email"
router.post("/check-email", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post('/reset-password', verify, userController.resetPassword);
// Handler function has access to the request object.
// Handler function should have access to "req.user" data if the the given token to the route is legitimate. This is possible because of the "next" function in the verify function found inside the "auth.js" file.

// Update the method to "get" since we won't be sending data from the request body anymore.

// The "getProfile" controller method is passed as middleware, the controller will have access to the "req" and "res" objects.
// This will also make our code look cleaner and easier to read as our routes no longer deal with logic.
// All business logic will now be handled by the controller.
router.get("/details", verify, userController.getProfile);

router.get('/google', passport.authenticate('google', {
	// scope contains the data that can be retrieved
	scope: ['email', 'profile'],
	// prompts user to choose a google account
	prompt: 'select_account'
}));

router.get('/google/callback', 
	// if the authentication is not successful
	passport.authenticate('google', {
		failureRedirect: '/users/failed'
	}),
	// if the authentication is successful, it will redirect us to the '/success' route
	function(req,res) {
		res.redirect('/users/success');
	}
);

router.get('/failed', (req,res) => {
	console.log('User is not authenticated');
	res.send('Failed');
})

router.get('/success', isLoggedIn, (req,res) => {
	console.log('You are logged in');
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`);
})

router.get('/logout', (req,res) => {
	req.session.destroy(err => {
		if(err) {
			console.log(`Error while destroying session: ${err}`);
		} else {
			console.log('You are logged out');
			res.redirect('/');
		}
	})
})

router.put('/profile', verify, userController.updateProfile);



module.exports = router;