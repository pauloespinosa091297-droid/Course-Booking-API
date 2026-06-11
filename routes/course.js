const express = require("express");
const courseController = require("../controllers/course");
// Deconstruct the "auth" module so that we can simply store "verify" and "verifyAdmin" in their variables and reuse it in our routes.
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// http://localhost:4000/courses/
router.post("/", verify, verifyAdmin, courseController.addCourse); 

// http://localhost:4000/courses/all
router.get("/all", verify, verifyAdmin, courseController.getAllCourses);

router.get("/", courseController.getAllActive);

router.get("/specific/:id", courseController.getCourse);

router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse); 

router.post('/search', courseController.searchCoursesByName);

module.exports = router;