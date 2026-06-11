// Dependencies and Modules
const express = require("express");
// this will allows us access to all the controiller functions inside controllers/enrollment.js
const enrollmentController = require("../controllers/enrollment");
// this allows us access to the verify function inside auth.js
const { verify } = require("../auth");

// Router
// http://localhost:4000/enrollments
const router = express.Router();

// Routes
// This route expects a POST request at the URI "/enroll"
// http://localhost:4000/enrollments/enroll
router.post('/enroll', verify, enrollmentController.enroll);

router.get('/get-enrollments', verify, enrollmentController.getEnrollments);

module.exports = router;