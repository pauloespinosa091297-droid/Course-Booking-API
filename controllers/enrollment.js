// Dependencies and Modules
// allows us access to the Enrollment model which connects us to the MongoDB database
const Enrollment = require("../models/Enrollment");
// allows us access to the errorHandler function inside auth.js
const { errorHandler } = require("../auth");

// controller function for enrolling a user to a course
module.exports.enroll = (req, res) => {

	// If the user is an admin
	if(req.user.isAdmin) {

		// They are not allowed to enroll to a course
		return res.status(403).send({ message: "Admin is forbidden" });
	}

	// If the user is not an admin, we will create a new Enrollment document
	let newEnrollment = new Enrollment({
		// Adding the id of the logged-in user from the decoded token
		userId: req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	});

	// Save the document in the database
	return newEnrollment.save().then(enrolled => {
		return res.status(201).send({
			success: true,
			message: "Enrolled successfully"
		});
	})
	.catch(error => errorHandler(error, req, res))
};

module.exports.getEnrollments = (req, res) => {

    return Enrollment.find({userId : req.user.id}).then(enrollments => {
        if(enrollments.length > 0) {
            return res.status(200).send(enrollments);
        }
        
        return res.status(404).send({ message: "No user found" });
    })
    .catch(error => errorHandler(error, req, res));
};