// [SECTION] Basic Express JS Server
// [SECTION] Dependencies and Modules
const express = require('express');
const mongoose = require('mongoose');
// cors package - allows our backend application to connect or be available to our frontend application
// Allows us to control the app's cross origin resource sharing setting. We will be able to manipulate and control what applications may use or server app.
const cors = require('cors');

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");

// Google Login
const passport = require('passport');
const session = require('express-session');
require('./passport');

// [SECTION] Environment Setup
// const port = 4000;
// "dotenv" package allows us to use the environment variables. This helps us hide sensitive information/credentials in our application
// Note: For best practice, create the environment variables at the start of the development
require('dotenv').config();

// [SECTION] Server Setup
const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Now connected to MongoDB Atlas'));

// you can set the specific needs of your application here
const corsOption = {
    // origin of the request
    origin: ['http://localhost:8000', 'http://localhost:5173'], // allows requests from this clientURL only. This is an array because multiple URL can be added for connection
    // methods: ['GET', 'POST'], // allow only specified HTTP methods
    // allowedHeaders: ['Content-Type', 'Authorization'], // allow only specified headers
    credentials: true, // allows credentials (e.g. cookies, authorization headers)
    optionsSuccessStatus: 200 // provides a status code for successful options request
}

// [SECTION] Middlewares
app.use(express.json());
app.use(cors(corsOption));
// [SECTION] Google Login
// create a session with the given data
// app.use(session({
//     secret: process.env.clientSecret,
//     // prevents the session from overwriting the secret while the session is active
//     resave: false,
//     // prevents the application from storing data in the session while the data has not yet been initialized
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);


// [SECTION] Server Listening
if(require.main === module) {
    app.listen(process.env.PORT || 3000, () => console.log(`API is now online on port ${process.env.PORT || 3000}`)); 
};

// In creating APIS, exporting modules in the "index.js" can be ommited
module.exports = {app, mongoose};