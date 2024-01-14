/**
    * index.js
    * This is your main app entry point
    */

    // Set up express, bodyparser and EJS
const express = require('express');
const session = require("express-session");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

app.use(session({
    secret: "]c7)R5%!*bzZ|#jVNEoJ~3!yB|.r~~cDjP6@<ljUZ3rjnvRlg2!5'Qas,N5!yCJ",
    resave: true,
    saveUninitialized: true,
    cookie: {
        // maxAge is milloseconds, so here we do 60 seconds (60 * 1000)
        // and then we multiply by 60 again so the cookie lasts 1 hour
        maxAge: 60 * 60 * 1000,
    }
}));


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
app.use('/users', usersRoutes);
app.use('/author', authorRoutes);
app.use('/reader', readerRoutes);


// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

