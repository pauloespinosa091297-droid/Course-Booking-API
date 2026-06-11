// For best practice, please name your model files in singular sentence case format
// [SECTION] Dependencies and Modules
const mongoose = require('mongoose');

// [SECTION] Mongoose Schema
const enrollmentSchema = new mongoose.Schema({
	userId: {
		// type property - refers to the data type expected for the given value
		type: String,
		// required property - refers to the necessity of the value
		// true - value is needed when creating the document. If the userID is not provided, the error message will be shown in the terminal
		required: [true, "UserID is required"]
	},
	enrolledCourses: [
		{
			courseId: {
				type: String,
				required: [true, "Course ID is required"]
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, "Total Price is required"]
	},
	enrolledOn: {
		type: Date,
		// Date.now property saves the current time and date upon creation of the document
		default: Date.now
	},
	status: {
		type: String,
		default: "Enrolled"
	}
});

// [SECTION] Mongoose Model
module.exports = mongoose.model("Enrollment", enrollmentSchema);