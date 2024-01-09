/**
    * index.js
    * This is your main app entry point
    */

    // Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Handle requests to the home page 
app.get('/', (req, res) => {
    res.render("home.ejs");
});

// Add all the route handlers in usersRoutes to the app under the path /users
const usersRoutes = require('./routes/users');
const authorRoutes = require('./routes/author');
const readerRoutes = require('./routes/reader');
const loginRoutes = require('./routes/login');
app.use('/users', usersRoutes);
app.use('/author', authorRoutes);
app.use('/reader', readerRoutes);
app.use('/login', loginRoutes);

// MY CODE STARTS HERE
/**
/**
* @desc Displays a page with login
*/
//app.get("/", (req, res) => {
//    res.render("login.ejs");
//});

/**
* @desc Checks if the login is valid with the database, and if so logs the
* user in
*/
//app.post("/login", (req, res, next) => {
//    // Define the query
//    query = "SELECT * FROM USERS WHERE user_name = ?;"
//    query_parameters = [req.body.user_name]
//    // Execute the query and send a confirmation message
//    global.db.all(query, query_parameters,
//        function (err, rows) {
//            if (err) {
//                next(err); //send the error on to the error handler
//            } else {
//                if (rows.length != 1 || req.body.password !== rows[0].password) {
//                    console.log("The user does not exist or your password is incorrect");
//                } else {
//                    console.log("Login successful!"); }
//            }
//        }
//    );
//});



// MY CODE ENDS HERE
//==================================================

    // Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

