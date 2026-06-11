// // This will contain the setup configuration for Google OAuth 2.0
// require('dotenv').config();
// // passport module/package is an authentication middleware for NodeJS
// const passport = require('passport');
// // Stretgies are algorithms that are used for a specific purpose
// const googleStrategy = require('passport-google-oauth20').Strategy;

// // This configures the 'passport' to use google oauth 2.0 authentication strategy
// passport.use(new googleStrategy({
// 	clientID: process.env.clientID,
// 	clientSecret: process.env.clientSecret,
// 	// callbackURL is the defined route on how the request will be handled after the google authentication
// 	callbackURL: "http://localhost:4000/users/google/callback",
// 	passReqToCallback: true
// },

// // this is a callback function that gets executed when a user is successfully authenticated
// // returns the 'profile' parameter which contains the information of the user
// function(request,accessToken,refreshToken,profile,done) {
//  	// done() parameter acts as a callback
// 	return done(null,profile);
// 	}
// ));

// // serializeUser convert object into bytes
// passport.serializeUser(function(user,done) {
// 	done(null,user);
// })

// // converts the bytes into  objects
// passport.deserializeUser(function(user,done) {
// 	done(null,user);
// })
