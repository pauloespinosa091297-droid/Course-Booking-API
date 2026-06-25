// [SECTION] Basic Express JS Server
// [SECTION] Dependencies and Modules
const express = require('express');
const mongoose = require('mongoose');
// cors package - allows our backend application to connect or be available to our frontend application
const cors = require('cors');

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");

// Google Login
const passport = require('passport');
const session = require('express-session');
require('./passport');

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Now connected to MongoDB Atlas'));

// [SECTION] CORS Configuration
// Dynamically accepts any incoming request origin to bypass all hardcoded array typos entirely
const corsOption = {
    origin: function (origin, callback) {
        // Automatically allow local testing, postman, or any web browser deployment origin
        callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// [SECTION] Middlewares
app.use(express.json());
app.use(cors(corsOption)); // Safely passes the dynamic corsOption object

// [SECTION] Google Login (Commented out as per original setup)
// app.use(session({
//      secret: process.env.clientSecret,
//      resave: false,
//      saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// [SECTION] API Routing Routes Pipeline
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

// [SECTION] Server Listening
if(require.main === module) {
    app.listen(process.env.PORT || 3000, () => console.log(`API is now online on port ${process.env.PORT || 3000}`)); 
}

module.exports = {app, mongoose};