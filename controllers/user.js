const User = require('../models/User');
// bcryptjs module/package - allows us to encrypt information
const bcrypt = require('bcryptjs');
const auth = require("../auth");

const { errorHandler } = require("../auth");

module.exports.checkEmailExists = (req, res) => {

    // Added validation to check if the email from the request body contains an "@" symbol
    if(req.body.email.includes("@")) {

        // If the email is valid, we will check if the email from the request body exists
        return User.find({ email : req.body.email })
        .then(result => {
            // If there is a document existing,
            if (result.length > 0) {

                // 409 status code means Conflict. This means that there is a duplicate record where another resource has  the same data.
                res.status(409).send({message:'Duplicate email found'});

            } else {

                // 404 status code means Not Found. There resource is not found e.g. missing webpage or missing documents in the databases
                res.status(200).send({message:'No duplicate email found'});
            };
        })
        .catch(err => errorHandler(err, req, res));

    // the email does not contain "@" symbol 
    } else {

        // send a 400 status code which means Bad Request (there is a wrong information provided in the request) with the message "false"
        return res.status(400).send({message:'Invalid email format'});
    }
};

module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number is invalid'});
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            // .hashSync() method - responsible for hashing/encrypting our information.
            // It accepts 2 arguments, the first argument is the information to be encrypted and the second argument is the number of salt rounds
            // salt rounds - number of times that the information is hashed
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then(result => {
            return res.status(201).send({
                message: 'User registered successfully',
                user: result
            })
        })
        .catch(err => errorHandler(err, req, res));
    }
};

// MEMBER 4 - START
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
        .then(result => {
            // if the user does not exist
            if(!result) {
                return res.status(404).send({ message: 'No email found' });
            // if the user exist
            } else {
                // .compareSync() method will compare the given arguments to check if it matches. It compares the non-encrypted password to the encrypted password
                // It returns true if the password matches
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                // If the password is correct
                if(isPasswordCorrect) {
                    // Invoking the createAccessToken() method to generate an access token from the auth.js file
                    // we are sending the user details as arguments
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                    });
                // if the password is incorrect
                } else {
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid email format' });
    } 
}

// The "getProfile" method now has access to the "req" and "res" objects because of the "next" function in the "verify" method.
module.exports.getProfile = (req, res) => {

    // The "return" keyword ensures the end of the getProfile method.
    // Since getProfile is now used as a middleware it should have access to "req.user" if the "verify" method is used before it.
    // Order of middlewares is important. This is because the "getProfile" method is the "next" function to the "verify" method, it receives the updated request with the user id from it.
    return User.findById(req.user.id)
    .then(user => {

        if (!user){
            return res.status(404).send({ message: 'User not found' })
        } else {
            user.password = "";
            // .status(status_code) is chained to send the HTTP status code together with the response back to the client
            // 200 status code means OK. The request is fulfilled because the response has been fetched and transmitted back to the client
            res.status(200).send(user);
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    errorHandler(error, req, res)
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}