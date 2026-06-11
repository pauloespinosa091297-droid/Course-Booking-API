// jsonwebtoken package/module - create an access token that will be used for verification/identity in our application
const jwt = require("jsonwebtoken");
require("dotenv").config();

// [SECTION] JSON Web Token
/*
	- JSON Web Token or JWT is a way of securely passing information from the server to the client or to other parts of a server
	- Information is kept secure through the use of the secret code
	- Only the system that knows the secret code that can decode the encrypted information
	- Imagine JWT as a gift wrapping service that secures the gift with a lock
	- Only the person who knows the secret code can open the lock
	- And if the wrapper has been tampered with, JWT also recognizes this and disregards the gift
	- This ensures that the data is secure from the sender to the receiver
*/

// [SECTION] Token Creation
/*
	Analogy: Pack the gift and provide a lock with the secret code as the key
*/
module.exports.createAccessToken = (user) => {

	// It will store the information received from the "user" parameter in the "data" variable
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// .sign() method will be used to generate the JSON Web Token
	// It accepts 3 arguments
		// The first argument contains the payload which is the information that we will send between application
		// The second argument contains the secret key that is found in the application defined by the developer
		// The third argument, which is optional, are additions to our jwt configurations
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};


//[SECTION] Token Verification
/*
Analogy
    Receive the gift and open the lock to verify if the the sender is legitimate and the gift was not tampered with
- Verify will be used as a middleware in ExpressJS. Functions added as argument in an expressJS route are considered as middleware and is able to receive the request and response objects as well as the next() function. Middlewares will be further elaborated on later sessions.
*/
module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined") {
		return res.send({auth: "Failed. No Token"});
	} else {
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);


		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {

			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				})

			} else {

				console.log("result from verify method: ")
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}

		})
	}
}


//[SECTION] Verify Admin
//The Verify Admin method will only be used to check if the user is an admin or not.

module.exports.verifyAdmin = (req, res, next) => {

	// console.log("result from verifyAdmin method: ");
	// console.log(req.user);

	if(req.user.isAdmin) {
		next();
	} else {

		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

module.exports.errorHandler = (err,req,res,next) => {
	console.error(err);

	const errorMessage = err.message || "Internal Server Error";

	res.json({
		error: {
			message: errorMessage,
			errorCode: err.code || "SERVER_ERROR",
			details: err.details || null
		}
	})
}

module.exports.isLoggedIn = (req,res,next) => {
	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}