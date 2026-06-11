const Course = require("../models/Course");
const { errorHandler } = require("../auth");

module.exports.addCourse = (req, res) => {

    let newCourse = new Course({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    // Add validation to check if a course with the same name already exists in the database
    return Course.findOne({ name: req.body.name}).then(existingCourse => {

        // If there is a document with the same name
        if(existingCourse) {

            // send a 409 status code which means Conflict and the message "true"
            return res.status(409).send({ message:'Course already exists'});

        // If there is no document with the same name
        } else {

            // save the document/course in the database
            return newCourse.save()
            .then(result => res.status(201).send({
                success: true,
                message: 'Course added successfully',
                result: result
            }))
            // Error handling is done using .catch() method where if there are any errors, it will be catch and saved in the variable "err"
            // We are now catching the error and sending it back as a response in postman
            // .catch(err => {
            //     // This will log the full error in the console/terminal
            //     console.error("error occurred while saving the course:", err);
            //     // send a simpler response to the user that they can easily understand
            //     // .status() method for sending a HTTP status code
            //     // 500 means Internal Server Error
            //     res.status(500).send({
            //         message: "An error occurred while saving the course",
            //         errorCode: "COURSE_SAVE_ERROR"
            //     })
            // })
            .catch(err => errorHandler(err, req, res));
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getAllCourses = (req, res) => {

    return Course.find({}).then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({ message: 'No courses found'});
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true }).then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({message:'No active courses found'});
        }
    })
    .catch(err => errorHandler(err, req, res));

};

module.exports.getCourse = (req, res) => {

    Course.findById(req.params.id).then(course => {
        if(course) {
            return res.status(200).send(course);
        } else {
            return res.status(404).send({message:'Course not found'});
        }
    })
    .catch(err => errorHandler(err, req, res));
    
};

module.exports.updateCourse = (req, res) => {
    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse, { new: true })
    .then(course => {
        if (course) {
            return res.status(200).send({
                success: true,
                message: 'Course updated successfully',
                data: course 
            });
        } else {
            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField).then(course => {
        if (course) {
            if (!course.isActive) {
                return res.status(200).send({
                    message: 'Course already archived',
                    course: course});
            }

            return res.status(200).send({
                success: true,
                message: 'Course archived successfully'});
        } else {
            return res.status(404).send({ message: 'Course not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.activateCourse = (req, res) => {

    return Course.findById(req.params.courseId)
    .then(course => {


        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }


        if (course.isActive) {
            return res.status(200).send({
                message: 'Course already activated',
                course: course
            });
        }


        course.isActive = true;

        return course.save().then(updatedCourse => {
            return res.status(200).send({
                success: true,
                message: 'Course activated successfully'
            });
        });

    })

    .catch(error => errorHandler(error, req, res));
};

module.exports.searchCoursesByName = async (req, res) => {
  try {
    const { courseName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const courses = await Course.find({
      name: { $regex: courseName, $options: 'i' }
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};